
import logging
import matplotlib
from matplotlib import pyplot as plt
import requests

matplotlib.use('Agg')

import pytz

from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.contrib import messages

from django.utils import timezone

from .models import Article, Discount, About, FAQ, Vacancy, User, Review, Service, Appoinment, DoctorProfile
from .forms import DoctorRegistrationForm, ClientRegistrationForm, UserLoginForm
from .decorators import unauthenticated_user


logger = logging.getLogger(__name__)

# Create your views here.

#-------->
def index(request):

    current_time = timezone.now()
    user_tz = pytz.timezone('Europe/Moscow')
    user_time = current_time.astimezone(user_tz)


    cat_fact = None
    covid_cases = None
    covid_api_url = "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay"
    api_url = "https://catfact.ninja/fact"
    response = requests.get(api_url)
    cresponce = requests.get(covid_api_url)


    if response.status_code == 200:
        cat_fact = response.json()['fact']

    if cresponce.status_code == 200:
        covid_cases = cresponce.json()['count']
        
    article = Article.objects.order_by('published_date').last()
    context = {
        'article' : article,
        'user_time' : user_time,
        'current_time' : current_time,
        'cat_fact' : cat_fact,
        'covid_cases' : covid_cases
    }
    logger.debug('index')
    return render(request, 'index.html', context)


def news(request):
    articles = Article.objects.order_by('-published_date')
    context = {
        'articles' : articles
    }
    return render(request, 'news.html', context)

def article_page(request, slug):
    article = Article.objects.get(slug=slug)
    context = {
        'article' : article
    }
    return render(request, 'article.html', context)


def faq(request):
    faqs = FAQ.objects.all()
    context = {
        'faqs' : faqs,
    }
    return render(request, 'faq.html', context)


def contacts(request):
    doctors = User.objects.filter(groups__name='doctor')
    context = {
        'doctors' : doctors
    }
    return render(request, 'contacts.html', context)


def about_us(request):
    about_us = About.objects.latest('id')
    context = {
        'about_us' : about_us
    }
    return render(request, 'about_us.html', context)

@login_required(login_url='login')
def services(request):
    services = Service.objects.all()
    group = Group.objects.get(name='doctor')
    context = {
        'services' : services,
        'group' : group 
    }
    return render(request, 'services.html', context)


def appointment_approve(request):
    if request.method == 'POST':
        appointment_id = request.POST.get('appointment_id')
        appointment = Appoinment.objects.get(id=appointment_id)
        appointment.user_confirmed = True;
        appointment.save();

    return my_appointments(request)

def appointment_cancel(request):
    if request.method == 'POST':
        appointment_id = request.POST.get('appointment_id')
        appointment = Appoinment.objects.get(id=appointment_id)
        appointment.delete()

    return my_appointments(request)

def appointment_approve_doctor(request):
    if request.method == 'POST':
        appointment_id = request.POST.get('appointment_id')
        appointment = Appoinment.objects.get(id=appointment_id)
        appointment.doctor_confirmed = True;
        appointment.save();

    return my_appointments(request)

def appointment_add(request):
    if request.method == 'POST':
        service_id = request.POST.get('service_id')
        user_id = request.POST.get('user_id')
        service = Service.objects.get(id=service_id)
        user = User.objects.get(id=user_id)
        appointment = Appoinment()
        appointment.service_id = service
        appointment.doctor_id = appointment.service_id.doctor_id
        appointment.user_id = user
        appointment.save();
    
    return services(request)

@login_required(login_url='login')
def my_appointments(request):
    user = request.user
    if user.groups.filter(name="doctor").exists():
        doctors_id = DoctorProfile.objects.get(user_id=user.id)
        appointments = Appoinment.objects.filter(doctor_id=doctors_id)
    else:
        appointments = Appoinment.objects.filter(user_id=user.id)
    group = Group.objects.get(name='doctor')
    context = {
        'appointments' : appointments,
        'group' : group
    }
    return render(request, 'my_appointments.html', context)


def privacy_policy(request):
    return render(request, 'privacy_policy.html')

def reviews(request):
    reviews = Review.objects.order_by('-published_date')
    context = {
        'reviews' : reviews,
    }
    return render(request, 'reviews.html', context)

@login_required(login_url='login')
def add_review(request):
    rating = request.POST.get('rating')
    text = request.POST.get('text')
    user = request.user
    review = Review()
    review.rating = int(rating)
    review.text = text
    review.user_profile = User.objects.get(id=user.id)

    old_review = Review.objects.filter(user_profile=user)
    if old_review.exists():
        old_review_ = old_review.first()
        old_review_.rating = rating
        old_review_.text = text
        old_review_.user_profile = review.user_profile
        old_review_.save()
    else:
        review.save()
    logger.info(f"Review of user {user.username} successfully added")
    return reviews(request)


def discounts(request):
    discounts = Discount.objects.order_by('-valid_until')
    context = {
        'discounts' : discounts,
        'is_expired' : 'Discount is no longer available',
    }
    return render(request, 'discounts.html', context)


def vacancies(request):
    vacancies = Vacancy.objects.all()
    context = {
        'vacancies' : vacancies,
    }
    return render(request, 'vacancies.html', context)


#-------->

@unauthenticated_user
def register_doctor(request):
    if request.method == 'POST':
        form = DoctorRegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            doctor_group = Group.objects.get(name='doctor')
            user.groups.add(doctor_group)
            login(request, user)
            messages.success(request, 'Doctor account created successfully.')
            return redirect('index')
    else:
        form = DoctorRegistrationForm()
    context = {
        'form': form,
        'title': 'Doctor Registration'
    }
    return render(request, 'register.html', context)


@unauthenticated_user
def register_client(request):
    if request.method == 'POST':
        form = ClientRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            client_group = Group.objects.get(name='client')
            user.groups.add(client_group)
            login(request, user)
            messages.success(request, 'Client account created successfully.')
            return redirect('index')
    else:
        form = ClientRegistrationForm()
    context = {
        'form': form,
        'title': 'Client Registration'
    }
    return render(request, 'register.html', context)


@csrf_exempt
@unauthenticated_user
def login_view(request):
    if request.method == 'POST':
        logger.debug("login_view - POST")
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            logger.debug("login_view - Valid form")
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request,
                                username=username,
                                password=password,
                            )
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {user.username}.")
                return redirect('index')
            else:
                messages.error(request, "Invalid email/phone number or password.")
        else:
            logger.debug(f"invalid form {form.errors}, is bound {form.is_bound}")
            messages.error(request, "Invalid email/phone number or password.")
    else:
        form = UserLoginForm()
    context = {
        'form' : form,
        'title' : 'Login',
    }
    return render(request, 'login.html', context)


def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect('index')

@login_required(login_url='login')
def stats(request):
    cleaner_graph()
    return render(request, 'stats.html')




def cleaner_graph():
    services = Service.objects.all()
    result = {}
    for service in services:
        count = 0
        entries = Appoinment.objects.all()
        for entry in entries:
            if entry.service_id.name == service.name:
                count += 1
        result[service.name] = count
        
    names = list(result.keys())
    values = list(result.values())
    plt.barh(names, values, color='blue', height=0.5)
    plt.xlabel("appointments")
    plt.ylabel("Services")
    plt.title("Amount of appointments for each service")
    plt.savefig("./media/cleaner_graph.png")
    return "./media/cleaner_graph.png"

