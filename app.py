from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import traceback
import os
import time

# Assistant
# from watson_developer_cloud import AssistantV2
# from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from functions.credentials import getService
from functions.auth_user import auth, getUser
from flask import session
from logic import imageParser as ip

# Login
from flask import redirect, url_for, Response, abort, session
from flask_login import LoginManager, login_required, login_user, logout_user, UserMixin


# Image
import io
from PIL import Image

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})



# Secret Key to use for login
app.config.update(SECRET_KEY='aoun@ibm')

# flask-login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


# user model for login
class User(UserMixin):

    def __init__(self, id, name):
        self.id = id
        self.name = name

    def __repr__(self):
        return "%d/%s" % (self.id, self.name)

    def get_id(self):
        return self.id

    def is_anonymous(self):
        return False

    def is_active(self):
        return True


## Login methods ##
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        success, uid = auth(username, password)

        if (success):
            login_user(User(uid, username))
            return redirect(url_for('home'))
        else:
            return abort(401)
    else:
        return render_template("login.html")


# logout API
@app.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    session.clear()
    return redirect('login')


# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed, Invalid username or password</p>')


# callback to reload the user object
@login_manager.user_loader
def load_user(uid):
    return User(uid, getUser(uid))



# Secret Key to use for session
app.config.update(SECRET_KEY='aoun@ibm')

## Watson Assistant ##
api, url = getService('assistant')


ASSISTANT_ID = "12345"




############
### MAIN ###
############

## Main methods ##
@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.route('/')
def home():
    return render_template('new.html')


@app.route('/form')
def form():
    return render_template('/form.html')


## GET Request handler ##
@app.route('/local-api/post', methods=['POST'])
def getApi():
    try:
        print(request.form)
        req = request.form.to_dict()['request']
        print(req)

        time.sleep(2)

        return jsonify({'response': "POST Response", })

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


## GET Request handler ##
@app.route('/local-api/get', methods=['GET'])
def postApi():
    try:
        req = request.args.get('request')
        print(req)

        time.sleep(2)

        return jsonify({'response': "GET Response"})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


######################
### Image Handling ###
######################

@app.route('/local-api/image/driver1', methods=['POST'])
def postAPI1():
    try:
        data = request.files.get('image').read()

        image = Image.open(io.BytesIO(data))
        path = 'images/driverLicense1.jpg'
        image.save(path)

        time.sleep(2)

        demo_dict = ip.driver_dictionary(path)


        demo_dict['driver']=1
        return jsonify({'response': demo_dict})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


@app.route('/local-api/image/driver2', methods=['POST']) ## for car license
def postAPI2():
    try:
        path = 'images/carLicense1.png'
        data = request.files.get('image').read()

        image = Image.open(io.BytesIO(data))
        image.save(path)

        time.sleep(2)

        demo_dict = ip.car_license_dictionary(path)



        # demo_dict['driver'] = 2
        return jsonify({'response': demo_dict})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


@app.route('/local-api/image/driver3', methods=['POST'])
def postAPIDriver3():
    try:
        data = request.files.get('image').read()
        path = 'images/policy.jpg'
        image = Image.open(io.BytesIO(data))
        image.save(path)

        time.sleep(2)

        demo_dict = ip.policy_dictionary(path)

        demo_dict['driver'] = 3

        return jsonify({'response': demo_dict})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


@app.route('/local-api/image/driver5', methods=['POST'])
def postAPI5():
    try:
        data = request.files.get('image').read()

        image = Image.open(io.BytesIO(data))
        image.save('images/temp.png')

        time.sleep(2)


        imageParser1.text_parse(imageParser1.text_extract('images/temp.png'))

        imageParser1.doS()



        return jsonify({'response': demo_dict})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


@app.route('/local-api/image/driver4', methods=['POST'])
def postAPI4():
    try:
        data = request.files.get('image').read()

        image = Image.open(io.BytesIO(data))
        path = 'images/driverLicense1.jpg'
        image.save(path)

        time.sleep(2)
        demo_dict = ip.driver_dictionary(path)




        demo_dict['driver'] = 4

        return jsonify({'response': demo_dict})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


@app.route('/local-api/image/carLicense', methods=['POST'])
def postAPI3():#unused
    try:
        data = request.files.get('image').read()

        image = Image.open(io.BytesIO(data))
        image.save('images/temp.png')

        time.sleep(2)

    except Exception as e:

        return jsonify({'response': demo_dict})

        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


################################
### Public Json post request ###
################################

@app.route('/api/v1/process', methods=['POST'])
def publicAPI():
    try:
        data = request.get_json()

        time.sleep(2)

        return jsonify({'response': data})

    except Exception as e:
        traceback.print_exc(chain=False)
        return jsonify({"error": repr(e)})


## Main ##
if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='127.0.0.1', port=port, debug=True)
