import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';

interface UserDetail {
  _id: string
  email: string
  password: string
  name: string
  roles: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public temp:string

  constructor(public auth:AuthenticationService, private toastr:ToastrService) { }
  ngOnInit(): void {
    this.auth.profile().subscribe(
      user=>{
        this.details= user
        if(this.details.roles=="admin"){
          this.accounts()
        }
      },
      err=>{
        console.error(err)
      }
    )
    
  }

  details: UserDetail= {
    _id: "",
    email: "",
    password: "",
    name: "",
    roles: ""
  }

  changePswd(id:string, pswd:string): void {
    if(window.confirm("Are you sure you want to change password")){
      if(this.details.password===this.temp){ 
        this.auth.changePswd(this.details._id, this.temp).subscribe((data:{error, doc})=>{
          if(data.error){
            this.toastr.error("Error in editing details")
          }else{
            this.toastr.success("Password Updated Successfully!")
          }
        }) 
      }else{
        this.toastr.error("Password must be equal")
      }
    }
    this.ngOnInit()
  }

  detail: UserDetail= {
    _id: "",
    email: "",
    password: "",
    name: "",
    roles: ""
  }

  register():void{
    if(this.detail.password===this.temp){ 
      if(window.confirm("Are you sure you want to add New User?")){
        this.auth.register(this.detail.email,this.detail.name, this.detail.password, this.detail.roles).subscribe(
          (data:{error, user})=>{
            if(data.error){
              this.toastr.error("User already Exist")
      			}else{
              this.toastr.success('Registered Successfully!!')
            }    
          }
        )
      }
      this.accounts()
    }else{
      this.toastr.error("Passwords must be equal")
    }  
    this.cancel()
    this.accounts()
  }
account:UserDetail[]=[]

  accounts() : void{
    this.auth.accounts().subscribe((data: {doc,err})=>{
      if(data.err){
        console.log("Error in fetching tasks")
      }else{
        this.account = data.doc as UserDetail[]
      }
    })
  }

delAccount(id:string):void{
  if(window.confirm("Are you sure you want to delete this account?")){
    this.auth.delAccount(id).subscribe((data: {err, doc})=>{
      if(!data.err){
        this.accounts();
        this.toastr.success("Deleted Successfully")
      }else{
        this.toastr.error("Error in deleting event!")
      }
    })
  }
}

  cancel(): void{
    this.detail={
      _id: "",
      email: "",
      password: "",
      name: "",
      roles: ""
    }
  }
}
