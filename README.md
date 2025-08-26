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
Accounts/Users
</summary>

<details>
<summary>
Accounts Models
</summary>

- Modify `notes/models.py`, referenced [django.contrib.auth](https://docs.djangoproject.com/en/5.2/ref/contrib/auth/), [Customizing Authenticataion in Django](https://docs.djangoproject.com/en/5.2/topics/auth/customizing)

```py
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, user_email, password=None, **extra_fields):
        user = self.model(user_email=user_email, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(user_email, password, **extra_fields)
    
    def get_by_natural_key(self, user_email):
        return self.get(user_email=user_email)

# User Model
class User(AbstractBaseUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    USERNAME_FIELD = 'user_email'
    REQUIRED_FIELDS = ['user_name']
    
    objects = UserManager()
    
    def __str__(self):
        return self.user_email

class Note(models.Model):
    note_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    
```

- Update `notes/models.py` (Add User Relationship). 
- Better to use `settings.AUTH_USER_MODEL` as foreign key in `Notes`, in case the `AUTH_USER_MODEL` changes.

```py
from django.conf import settings

class Note(models.Model):
    note_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
      return str(self.note_title)  
```

</details>

<details>
<summary>
Serializers
</summary>

- Modify `notes/serializers.py`. (Convert to and from Json)

```py
from rest_framework import serializers
from .models import User, Note
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'user_name', 'user_email', 'password', 'last_update', 'created_on')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('note_id', 'note_title', 'note_content', 'last_update', 'created_on', 'user')
        read_only_fields = ('user',)
```

</details>

<details>
<summary>
Views
</summary>

- Modify `notes/views.py`, referenced [Generic Views](https://www.django-rest-framework.org/api-guide/generic-views/)

```py
from django.shortcuts import render
from .models import User, Note
from .serializers import UserSerializer, NoteSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        user_email = request.data.get('user_email')
        password = request.data.get('password')
        user = authenticate(request, username=user_email, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):

```

- Update `notes/views.py` with

```py
from rest_framework.permissions import IsAuthenticated

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
```

</details>

<details>
<summary>
URLs
</summary>

- Modify `accounts/urls.py`

```py
from django.urls import path
from .views import RegisterView, LoginView, NoteListCreateView, NoteDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('notes/', NoteListCreateView.as_view(), name='note-list'),
    path('notes/<uuid:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
```

- Update `backend/urls.py` to include the URLconf defined in `notes.urls`

```py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView # verifies if a token is valid or not
)

urlpatterns = [    
    path("api/", include("notes.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # allow API users to verify HMAC-signed tokens without having access to the signing key
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("admin/", admin.site.urls),
]
```

Now test the api paths in localhost as well as the admin panel, `http://localhost:8000/admin` displays  admin panel.

</details>

<details>
<summary>
Migrations
</summary>

```sh
# Delete existing migrations and database for starting fresh
# rmdir for windows
rm -rf accounts/migrations
rm -rf notes/migrations
rm db.sqlite3

python manage.py makemigrations notes
python manage.py migrate

python manage.py createsuperuser
```

Features Implemented:

- JWT Authentication with access and refresh tokens
- User Registration with email and password validation
- User Login/Logout with token management
- Protected API endpoints requiring authentication
- User-specific notes (users can only see their own notes)
- Token refresh functionality
- CORS configuration for frontend integration
- Custom User model with email as username

</details>
</details>

<details>
<summary>
Frontend
</summary>

</details>
</details>
