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
</details>