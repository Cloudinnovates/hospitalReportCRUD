import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  name: any;
  tcNo: any;
  blood: any;
  address: any;
  fileId: any;
  selectedFileOne: File;
  selectedFileTwo: File;
  selectedFileThree: File;
  reportDetail: any = {};
  addUserSection: boolean;
  imageArr: any;
  editImage: any = { one: '', two: '', three: '' };
  showReport = false;
  userDate: any;
  constructor(private dataService: ReportsService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() {
    this.dataService.getToken();

  }
  showUser() {
    this.addUserSection = !this.addUserSection;
  }
  addUser() {
    this.userDate = document.getElementsByName('dateUser')[0];
    this.userDate = this.userDate.value;

    if (this.name && this.fileId && this.tcNo && this.userDate) {
      this.dataService.postUser(this.fileId, this.name, this.tcNo, this.blood, this.address, this.userDate).then((data: any) => {
        console.log(data, 'kullanıcı post Edildi');
        if (data.error) {
          if (data.error === 'Internal Server Error') {
            return window.alert('Kullanıcı eklenemedi. Girdiğiniz değerleri kontrol edin.');
          }
          if (data.error.text) {
            return window.alert(data.error.text);
          }
        }


        // rapor ekleme kısmındaki dosya no burda veriliyor
        this.reportDetail.fileNo = this.fileId;
        this.showReport = true;
        return this.addUserSection = true;
      });
    } else {
      window.alert('Lütfen Tüm Bilgileri Doldurunuz');
    }

  }
  addReport(images) {
    this.reportDetail.date = document.getElementsByName('dateReport')[0];
    this.reportDetail.date = this.reportDetail.date.value;
    console.log(this.reportDetail.date);

    if (this.reportDetail) {
      this.dataService.postReport(this.reportDetail, images).then((data: any) => {
        console.log(data);
        if (data.dosyaNo) {
          this.router.navigate(['list']);
        }
        if (data.error) {
          window.alert('Rapor eklenirken bir hata oluştu. Lütfen değerleri kontrol edip tekrar deneyiniz.');
        }

        console.log(data, 'raporUploadEdildi');
      });
    } else {
      window.alert('Lütfen tüm değerleri girdiğinizden emin olun.');
    }

  }
  formatDate() {
    return this.reportDetail.date = this.reportDetail.date
      .replace(/^(\d\d)(\d)$/g, '$1/$2').replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2').replace(/[^\d\/]/g, '');
  }

  /* Fotograf Seçme */
  onFileChanged(event, index) {
    this.imageArr = [];
    if (index === 1) {
      this.selectedFileOne = event.target.files[0];
      //  this.editImage.one = index;
    }
    if (index === 2) {
      this.selectedFileTwo = event.target.files[0];
      //  this.editImage.two = index;
    }
    if (index === 3) {
      this.selectedFileThree = event.target.files[0];
      //   this.editImage.three = index;
    }
    this.imageArr.push({ imageOne: this.selectedFileOne, imageTwo: this.selectedFileTwo, imageThree: this.selectedFileThree });
    console.log(this.imageArr);

  }
  /*Fotograf Yükleme ve Rapor Gönderme*/
  onUpload() {
    // rapor için gönderilecek olan image arrayimiz
    const reportImageArr = [];
    if (this.imageArr) {

      this.dataService.postImage(this.imageArr, this.fileId).then((data: any) => {
        console.log(data);
        data.forEach(element => {
          reportImageArr.push(element.fileDownloadUri);
        });
        console.log(reportImageArr, 'reportImage');
        this.addReport(reportImageArr);
      });
    } else {
      this.addReport('');
    }

  }

}
