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

</details>