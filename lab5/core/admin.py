from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Article, Discount, User, About, FAQ, Vacancy, Workers_UID, Review, Service, Appoinment, DoctorProfile, Sponsor

# Register your models here.

admin.site.register(User)
admin.site.register(Article)
admin.site.register(Discount)
admin.site.register(About)
admin.site.register(FAQ)
admin.site.register(Vacancy)
admin.site.register(Workers_UID)
admin.site.register(Review)
admin.site.register(Service)
admin.site.register(Appoinment)
admin.site.register(DoctorProfile)
admin.site.register(Sponsor)
