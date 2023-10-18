import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  name = 'Angular';
  button = 'Send OTP';
  emailSentFailed : boolean = false;
  buttonDisabled : boolean = false;
  loginForm:any = FormGroup;
  retryAttempts : number = 10;
  sentOTP = false;
  otp: any = null;
  email : string = '';
  showMessage : boolean = false;
  OTP_Verified : boolean = false;
  screen_lable : string = 'Login';
  email_status : string = '';


  constructor(private apiService : ApiServiceService) { }

  ngOnInit(){
    this.loginForm = new FormGroup({
      email : new FormControl(null,[Validators.required]),
      otp : new FormControl()
    })
  }

  setValidatorForOTP(){
    const otpControl: AbstractControl | null = this.loginForm.get('otp');
      // Check if the control exists
      if (otpControl) {
        // Add your custom validator function
        otpControl.addValidators(Validators.required)

        // Update the validity status
        otpControl.updateValueAndValidity();
      }
  }


  oneMinuteTimer() {
    console.log("Timer started. This message will appear in 1 minute.");
  
    // Set a timer for 1 minute (60,000 milliseconds)
    setTimeout(()=>{
      console.log("Timer complete. 1 minute has passed.");
      if(!this.OTP_Verified){
        this.screen_lable = 'timeout after 1 min';
        this.OTP_Verified = true;
        this.otp = null;
      }
    }, 60000);
  }
  

  async sendEmail(){
    
    (await this.apiService.sendEmail(this.email)).subscribe((response) =>{
      if(response.statusCode == 200){
        this.otp = response.data.otp;
        this.sentOTP = true;
        this.button = 'Continue with OTP';
        this.buttonDisabled = false;
        this.email_status = "email containing OTP has been sent successfully";
      }else{
        this.sentOTP = false;
        this.emailSentFailed = true;
        this.buttonDisabled = false;
        this.email_status = "email address does not exist or sending to the email has failed";
      }
    })
  }
  
  submit(){
    console.log("Form : ",this.loginForm.status)
    
    if(this.loginForm.value.email.endsWith(".dso.org.sg") || this.loginForm.value.email.endsWith("gmail.com")){
      this.email_status = "";
      this.showMessage = false;
    }else{  console.log("Please use correct email ");
      this.email_status = "email address is invalid";
      this.showMessage = true;
      return;
    }

    if(this.retryAttempts == 0){
      this.screen_lable = 'OTP is wrong after 10 tries';
      this.OTP_Verified = true;
      this.otp = null;
    }

    if(this.loginForm.status == 'VALID' && this.loginForm.value.email 
    && (this.loginForm.value.email.endsWith(".dso.org.sg") || this.loginForm.value.email.endsWith("gmail.com")) 
    && !this.loginForm.value.otp){
        this.email = this.loginForm.value.email;
        this.buttonDisabled = true;
        this.setValidatorForOTP();
        this.sendEmail();
        this.oneMinuteTimer();  
    }else if(this.loginForm.status == 'VALID' && this.loginForm.value.email && this.loginForm.value.otp
     && this.loginForm.value.email && this.email && this.loginForm.value.otp == this.otp){
      this.retryAttempts = 0;
      this.OTP_Verified = true;
      this.screen_lable = 'OTP is valid and checked';
      console.log("OTP Verified")
    }else if(this.loginForm.status == 'VALID' && this.loginForm.value.email && this.loginForm.value.otp
    && this.loginForm.value.otp != this.otp){
      this.retryAttempts = this.retryAttempts - 1;
      console.log("Incorrect OTP with remaining attempts : ",this.retryAttempts);
   }else{
        this.buttonDisabled = false;
   }
  }

}
