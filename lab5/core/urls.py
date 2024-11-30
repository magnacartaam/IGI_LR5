from django.urls import path
from . import views


urlpatterns = [
        path('', views.index, name='index'),
        path('faq/', views.faq, name='faq'),
        #path('services/', views.services, name='services'),
        path('services/', views.services_view, name='services'),
        path('my_appointments/', views.my_appointments, name='my_appointments'),
        path('contacts/', views.contacts, name='contacts'),
        path('about_us/', views.about_us, name='about_us'),
        path('privacy_policy/', views.privacy_policy, name='privacy_policy'),
        path('reviews/', views.reviews, name='reviews'),
        path('discounts/', views.discounts, name='discounts'),
        path('vacancies/', views.vacancies, name='vacancies'),
        path('register/doctor/', views.register_doctor, name='register_doctor'),
        path('register/client/', views.register_client, name='register_client'),
        path('login/', views.login_view, name='login'),
        path('logout/', views.logout_view, name='logout'),
        path('news/', views.news, name='news'),
        path('<slug:slug>', views.article_page, name="article"),
        path('appointment_approve/', views.appointment_approve, name="appointment_approve"),
        path('appointment_approve_doctor/', views.appointment_approve_doctor, name="appointment_approve_doctor"),
        path('appointment_add/', views.appointment_add, name="appointment_add"),
        path('appointment_cancel/', views.appointment_cancel, name="appointment_cancel"),
        path('add_review/', views.add_review, name="add_review"),
        path('stats/', views.stats, name="stats"),
        path('managment/', views.managment, name="managment"),
        path('more_data/', views.some_tasks, name="more_data"),
        # path('doctors/', views.managment, name='managment'),
        # path('doctors/data/', views.get_doctors_data, name='doctors_data'),
        # path('doctors/add/', views.add_doctor, name='add_doctor'),
]
