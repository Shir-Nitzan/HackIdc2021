import cv2
import pytesseract as p
import re


p.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# DETAILS = dict.fromkeys(['firstName', 'lastName', 'licenseNumber', 'ID', 'address', 'birthDay'])
#
# img_path = '../images/timbo.png'
# demo ={
#     'lastName': 'Noa',
#     'firstName': 'Minsker',
#     'id': '123456789',
#     'address': 'some address',
#     'birthday': '29.06.1993',
#     'licenseNumber': '1234567',
#     'driverIsInsured': True,
#     'validLicense': True,
#     'licenseLevel': 'B',
#     'publicationDate': '20.6.2017',
#     'expirayDate': '29.06.2021'
# }


def img_to_string(img_path):
    img = cv2.imread(img_path)
    text_to_parse = p.image_to_string(img, lang='heb+eng')

    # helper prints
    text_to_parse = text_to_parse.replace('\n\n', '\n')

    text_to_parse = text_to_parse.replace(u'\u200e', '')
    text_to_parse = text_to_parse.replace(u'\u200f', '')
    text_to_parse = text_to_parse.replace(u'\x0c', '')

    return text_to_parse


def tokenize(parsed):
    """ from the parsed string return a token list"""
    list_text_to_parse = parsed.split('\n')
    list_text_to_parse[:] = [x for x in list_text_to_parse if x != '' and x != ' ']
    return list_text_to_parse


def parse_first_name(parsed_list):
    """ get the first name"""
    return parsed_list[4]


def parse_last_name(parsed_list):
    """ returns the last name"""
    return parsed_list[2]


def parse_address(parsed_list):
    """ returns the parsed address"""
    for token in parsed_list:
        if re.match(r'.*8[.].*', token):
            s = re.sub(r'[A-Z]', '', token)
            s = s.replace("8.", '')
            s = s.replace(".8", '')
            s = s.strip()
            return s


def parse_id(tokens):
    for token in tokens:
        s = re.search(r"(.*)(ID|1D)( )*([0-9]{9})", token)
        if s:
            return s.group(4)


def sort_dates(date):
    return date[-4:]


def parse_license_number(tokens):
    for token in tokens:
        s = re.search(r"(.*)(9[0-9]{6}).*", token)
        if s:
            return s.group(2)


def get_dates(string):
    date = r"([0-9]{2}\.[0-9]{2}\.[0-9]{4})"
    dates = re.findall(date, string)

    return sorted(dates, key=sort_dates)


def driver_dictionary(img_path):
    parsed_string = img_to_string(img_path)
    token_list = tokenize(parsed_string)
    dates = get_dates(parsed_string)

    if len(dates) < 3:
        dates.append(None)
        dates.append(None)

    info = {
        'lastName': parse_last_name(token_list),
        'firstName': parse_first_name(token_list),
        'id': parse_id(token_list),
        'address': parse_address(token_list),
        'birthday': dates[0],
        'licenseNumber': parse_license_number(token_list),
        'driverIsInsured': None,
        'validLicense': None,
        'licenseLevel': None,
        'publicationDate': dates[1],
        'expirayDate': dates[2]
    }

    return info


def get_model_code(parsed_string):
    pattern = r"([0-9]{4,}-[0-9]{4})"
    return re.findall(pattern, parsed_string)


def get_car_details(tozeret_cd, degem_cd):
    """
    :param tozeret_cd:
    :param degem_cd:
    :return: a string of manfacture & model
    """
    from urllib.request import urlopen
    url = "https://data.gov.il/api/3/action/datastore_search?limit=1000&q={0}&resource_id=142afde2-6228-49f9-8a29-9b6c3a0cbe40".format(tozeret_cd)
    response = urlopen(url)
    response = response.read().decode('utf-8')

    import json
    resDic = json.loads(response)
    records = resDic['result']['records']

    for rec in records:
        if rec["tozeret_cd"] == tozeret_cd and rec["degem_cd"] == degem_cd:
            return rec


def get_codes(parsed_string):
    pattern = r"([0-9]{4,}-[0-9]{4})"
    res = re.findall(pattern, parsed_string)
    if res:
        res = res[0]

    res = res.split('-')
    res = [int(r) for r in res]

    return tuple(res)


def get_car_number_from_car_license(parsed):
    s = re.findall(r"([0-9]{7,})-[0-9]+-[0-9]", parsed)
    if s:
        return s[0]


def car_license_dictionary(img_path):
    parsed = img_to_string(img_path)
    car_details = get_car_details(*get_codes(parsed))

    info = {
        'ownerName': parse_owner_name(parsed),
        'creationYear': car_details['shnat_yitzur'],
        'carType': car_details['sug_degem'],
        'model': car_details["degem_nm"] + " " + car_details["tozeret_nm"],
        'carNumber': get_car_number_from_car_license(parsed)
    }

    return info


def parse_owner_name(parsed):
    parsed = parsed.split('\n')
    for token in parsed:
        if re.findall("בעלים", token):
            token = re.sub(r"\\|[0-9]|בעלים", '', token)
            return token.strip()


def get_policy_owner_name(tokens):
    name = None

    for i, t in enumerate(tokens):
        if "שם בעל הפוליסה" in t:
            name = tokens[i+1]

    return name.strip()


def get_policy_number(tokens):
    for x in tokens:
        if "מספר הפוליסה" in x:
            res = re.findall(r"[0-9]+", x)
            if res:
                return res[0]


def policy_dictionary(img_path):
    parsed = img_to_string(img_path)
    tokens = parsed.split('\n')
    tokens = [x for x in tokens if x != " "]

    policy = {
        "policyOwnerName": get_policy_owner_name(tokens),
        "policyNumber": get_policy_number(tokens),
    }

    return policy


# if __name__ == '__main__':
#     parsed = img_to_string(img_path)
#     parsed = parsed.split('\n')
#     token = [x for x in parsed if x != " "]
#
#     print(policy_dictionary(img_path))
#
#     # print(get_car_details(*get_codes(parsed)))
#     # parsefirstName()
#     # parseLastName()
#     # paseAddress()\
#
#     # print(get_dates(parsed))
#     # print(driver_dictionary(img_path))
#
#
#
# # '00771-0035'