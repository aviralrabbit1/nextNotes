# nextNotes
Notes App with nextjs and django

## 1. Setup

<details>
<summary>
Django setup
</summary>

### 1. Bootstraping my Django project

Based on [First django app](https://docs.djangoproject.com/en/5.2/intro/tutorial01/)

```sh
mkdir nextnotes
cd nextnotes
# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install Django and dependencies
pip install django djangorestframework django-cors-headers

django-admin startproject backend
cd backend
py manage.py startapp notes
```

### 2. Cheking app
<details>
<summary>
Intial view
</summary>

Modified `notes/views.py`

```py
from django.http import HttpResponse


def index(request):
    return HttpResponse("Notes App")
```
</details>

<details>
<summary>
Initals urls
</summary>

Define a URLconf for the polls app, create a file `notes/urls.py `

```py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```
</details>
<details>
<summary>
Configure the root URLconf
</summary>

To include the URLconf defined in `notes.urls`

```py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("notes/", include("notes.urls")),
    path("admin/", admin.site.urls),
]
```

Now `http://localhost:8000/notes/` displays "Notes App" in browser

</details>

<details>
<summary>
Database
</summary>

Create a tables in the database. The `migrate` command looks at the `INSTALLED_APPS` setting and creates any necessary database tables according to the database settings in the `mysite/settings.py` file and the database migrations shipped with the app
```sh
py manage.py migrate
```

<details>
<summary>
Models
</summary>

```
Database Models
a. USER
i. user_id – uuid
ii. user_name – varchar
iii. user_email – varchar 
iv. password – varchar
v. last_update – date
vi. create_on – date

b. NOTES
i. note_id – uuid
ii. note_title – varchar
iii. note_content – varchar 
iv. last_update – date
v. created_on – date
```

For unique user_id, i used [uuid](https://docs.djangoproject.com/en/5.2/ref/models/fields/#uuidfield) (stores in a uuid datatype, otherwise in a char(32))

Modify `notes/models.py` accordingly.
```py
from django.db import models
import uuid

# Create your models here.
class User(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_name = models.CharField(max_length=255)
    # other fields

    def __str__(self):
      return self.user_name
```

```py
    def __str__(self):
      return self.user_name
```
- Defines how Python (and Django) will represent the object as a string
- print the object or see it in the Django admin, shell, or queryset results, it shows the note’s title: `note_title` instead of `Note object`
- Always implement `__str__` on the models so Django admin, logs, and debugging are easier. Typically, returns a field that uniquely identifies the object (like username for User, title for Note).
</details>

<details>
<summary>
why not use less max_length=31?
</summary>
I wanted to use `maxlength=31`, but then i searched, 
Does lowering max_length optimize storage?

Short answer: Yes, but only slightly — and usually not enough to matter unless you have millions of rows.

How storage works for VARCHAR(N) / CharField(max_length=N)
PostgreSQL / MySQL / SQLite (common Django backends):

- VARCHAR(N) does not reserve N bytes.
- It only stores the actual string length + 1–4 bytes overhead (depending on DB).
- Example:
"abc" in a VARCHAR(255) → uses 3 bytes for the text + 1 byte for length info.
"abc" in a VARCHAR(31) → uses the exact same amount.
- the storage used is proportional to actual string length, not max_length.
- When max_length does matter: Validation: Django and the DB reject longer input automatically.
- Indexing: Shorter max_length can make indexes slightly smaller. E.g. indexing a VARCHAR(31) vs VARCHAR(255) saves some space because the index pages are smaller.
- Portability: Some older DBs (or MySQL with certain encodings) had indexing restrictions like "can only index first 191 chars in UTF8". Smaller lengths avoid those issues.
</details>

<details>
<summary>
Activating Models
</summary>

To include the app in our project, add a reference to its configuration class in the `INSTALLED_APPS` setting. The NotesConfig class is in the polls/apps.py file, so its dotted path is 'notes.apps.NotesConfig'. Edit the `backend/settings.py` file and the path to the `INSTALLED_APPS` setting.

```py
# backend/settings.py

INSTALLED_APPS = [
    # others
    'notes.apps.NotesConfig',
]
```

Now Django knows to include the `notes` app. Now run:

```sh
py manage.py makemigrations notes
```

By running `makemigrations`, Django knows that we’ve made some changes to your models/database schema(or created a new one).

returns
```sh
Migrations for 'notes':
  notes\migrations\0001_initial.py
    + Create model Notes
    + Create model User
```
`sqlmigrate` command takes migration names and returns their SQL:
```sh
py manage.py sqlmigrate notes 0001
```

Gives:
```sql
BEGIN;
--
-- Create model Notes
--
CREATE TABLE "notes_notes" ("note_id" char(32) NOT NULL PRIMARY KEY, "note_title" varchar(255) NOT NULL, "note_content" text NOT NULL, "last_update" datetime NOT NULL, "created_on" datetime NOT NULL);
--
-- Create model User
--
CREATE TABLE "notes_user" ("user_id" char(32) NOT NULL PRIMARY KEY, "user_name" varchar(255) NOT NULL, "user_email" varchar(254) NOT NULL UNIQUE, "password" varchar(255) NOT NULL, "last_update" datetime NOT NULL, "created_on" datetime NOT NULL);
COMMIT;
```

</details>

<details>
<summary>
Migrations
</summary>

- To checks for any problems in the project without making migrations or touching the database.
, run 
```sh
py manage.py check
```

- To take all the migrations that haven’t been applied (tracked using database called django_migrations) and run them against the database - synchronizing the changes made to the models with the schema in the database, run migrate again to create those model tables in the database:
```sh
py manage.py migrate
```

- Run `python manage.py makemigrations` to create migrations for those changes
- Run `python manage.py migrate` to apply those changes to the database.

</details>
</details>

### 3. Checking admin

<details>
<summary> 
Admin User
</summary>

- Creating a `admin user` with a username,  prompt for an email address and a password, referenced from [Creating an admin user](https://docs.djangoproject.com/en/5.2/intro/tutorial02/#creating-an-admin-user)
```sh
py manage.py createsuperuser
```
</details>

<details>
<summary>
Make the app modifiable from admin
</summary>

- In admin panel, The editable content: `groups and users` are provided by `django.contrib.auth`. 
- To tell the admin that `Notes` has an admin interface, modify the `notes/admin.py` file,

```py
from django.contrib import admin
from .models import User, Notes

admin.site.register(User)
admin.site.register(Notes)
```

</details>

### 4. Creating APIs
Install Django rest framework and build out our api with

```sh
pip install djangorestframework django-cors-headers
```

<details>
<summary>
Serializer
</summary>

- Creating a serializer for the model,which will handle converting the model instance to and from JSON. 
- Create `notes/serializers.py` file

```py
from rest_framework import serializers
from .models import Notes

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__'
```

</details>

<details>
<summary>
CRUD functionality with APIs
</summary>

Use `notes/views.py` and create `notes/utils.py` (utility functions, separated into modules to keep the code organized and reusable), Added mock data through `admin` panel to test.
`note_id = 26a539e1-ee17-40fb-a7b7-8569010998bc`

Was stuck here why my api wasn't being read, so took help of ai to understand how to do requests similar to curl in windows.

```sh
Invoke-RestMethod -Uri "http://localhost:8000/api/notes/" -Method GET

note_id      : 26a539e1-ee17-40fb-a7b7-8569010998bc
note_title   : FIrst Note
note_content : Some Content
last_update  : 2025-08-21T19:44:38.822578Z
created_on   : 2025-08-21T19:44:38.822578Z
```

</details>
</details>

<details>
<summary>
Frontend Nextjs
</summary>

```sh
bunx create-next-app@latest

√ What is your project named? ... frontend
√ Would you like to use TypeScript? ... No / Yes
√ Which linter would you like to use? » ESLint
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like your code inside a `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to use Turbopack? (recommended) ... No / Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes
Creating a new Next.js app in D:\Projects\nextNotes\frontend.
```

Install dependencies as per required:
```sh
bun add axios @reduxjs/toolkit react-redux
```

<details>
<summary>
API functionalities
</summary>

Create `frontend/lib/api.js`, provide backend URL, add CRUD functionality
- getAllNotes
- getNote
- createNote
- updateNote
- deleteNote
</details>

<details>
<summary>
Redux store
</summary>

Create `store/notesSlice.js`, with 

```js
const initialState = {
  selectedNote: null,
  isEditing: false,
  formData: {
    note_title: '',
    note_content: '',
  },
}
const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
    ...
    } 
})
```

</details>
</details>

### Authentication

<details>
<summary>
Backend
</summary>

<details>
<summary>
Install Required Package
</summary>

- reference [django-rest-framework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html)

```sh
pip install djangorestframework-simplejwt
```
</details>

<details>
<summary>
Configure backend
</summary>

- Modify `backend/settings.py`. To store the `secret` securely,
```sh
pip install python-decouple
```

```py
from decouple import config
from datetime import timedelta

SECRET_KEY = config("JWT_SECRET")  # Django secret key taken from `.env` file
CORS_ALLOW_CREDENTIALS = True
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
```
</details>

<details>
<summary>
Accounts app
</summary>

- Created with
```sh
py manage.py startapp accounts
```

<details>
<summary>
Accounts Models
</summary>

- Modify `accounts/models.py`

```py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
```

</details>

<details>
<summary>
Serializers
</summary>

- Create `accounts/serializers.py`

```py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
class UserLoginSerializer(serializers.Serializer):
class UserSerializer(serializers.ModelSerializer):
```

</details>

</details>

</details>