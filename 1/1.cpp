#include<stdio.h>
int n=0;
int num=0;
int num12=0;
int bihua(int i){
	if(i==1)return 1;
	if(i==2||i==7||i==8||i==9)return 2;
	if(i==3)return 3;
	if(i==4)return 5;
	if(i==5||i==6)return 4;
	if(i==0)return 13;
}
int shuyear(int i){
	int i1=i%10;
	int i2=(i/10)%10;
	int i3=(i/100)%10;
	int i4=i/1000;
	int year=bihua(i1)+bihua(i2)+bihua(i3)+bihua(i4);
	return year;
}
int main(){
	for(int nian=2000;nian<=2024;nian++){
		int year=shuyear(nian);
		for(int yue=1;yue<=12;yue++){
			if(yue==2||yue==4||yue==6||yue==9||yue==11){
			if(yue<10){
			n+=bihua(yue)+bihua(0);
			for(int i=1;i<=30;i++){
				if(i<10){
			n+=bihua(i)+bihua(0);
		}
		else{
			int ge=i%10;
			int shi=i/10;
			n+=bihua(ge)+bihua(shi);
		}
		if(n+year>50)num++;
		n=bihua(yue)+bihua(0);
			}
		}
		else{
			int ge=yue%10;
			int shi=yue/10;
			n+=bihua(ge)+bihua(shi);if(yue<10){
			n+=bihua(yue)+bihua(0);
			for(int i=1;i<=30;i++){
				if(i<10){
			n+=bihua(i)+bihua(0);
		}
		else{
			int ge1=i%10;
			int shi1=i/10;
			n+=bihua(ge1)+bihua(shi1);
		}
		if(n+year>50)num++;
		n=bihua(ge)+bihua(shi);
			}
		}
		}
		}
		//
		else{
			if(yue<10){
			n+=bihua(yue)+bihua(0);
			for(int i=1;i<=31;i++){
				if(i<10){
			n+=bihua(i)+bihua(0);
		}
			else{
			int ge=i%10;
			int shi=i/10;
			n+=bihua(ge)+bihua(shi);
		}
		if(n+year>50)num++;
		n=bihua(yue)+bihua(0);
			}
		}
			else{
			int ge=yue%10;
			int shi=yue/10;
			n+=bihua(ge)+bihua(shi);
			for(int i=1;i<=31;i++){
				if(i<10){
			n+=bihua(i)+bihua(0);
		}
			else{
			int ge1=i%10;
			int shi1=i/10;
			n+=bihua(ge1)+bihua(shi1);
		}
			if(n+year>50)num++;
		n=bihua(yue)+bihua(0);
			}
		}
		}
		}
		}
		printf("%d",num);
	}

