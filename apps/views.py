from django.shortcuts import render,HttpResponse

def response(request):
	return HttpResponse("122221121")
def response2(request):
	return render(request,"index.html")
