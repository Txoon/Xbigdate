from django.shortcuts import render


def index(request):
    #return render(request, "multiends/try.html")
    return render(request, "multiends/web.html")


