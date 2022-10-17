import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserDto } from 'src/app/model/create-user.dto';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  user !: FormGroup;
  userDto: CreateUserDto = new CreateUserDto();
  userObj : User = new User();
  userList : User[] = [];
  loadingTable: boolean = false;
  formValid: boolean = true;
  emailInvalid: boolean = false;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private employeeService: UserService) { }

  ngOnInit(): void {
    this.user = this.formBuilder.group({
      id: [''],
      username: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.email]],
      phone: ['',[Validators.required]],
      skillsets: ['',[Validators.required]],
      hobby: ['',[Validators.required]]
    })

    this.getAllUser();
  }

  public open(modal: any): void {
    this.formValid = true;
    this.emailInvalid = false;
    this.modalService.open(modal);
  }

  editUser(modal: any, usr: User): void{
    this.open(modal);
    this.user.controls['username'].setValue(usr.username);
    this.user.controls['email'].setValue(usr.email);
    this.user.controls['hobby'].setValue(usr.hobby);
    this.user.controls['phone'].setValue(usr.phone);
    this.user.controls['skillsets'].setValue(usr.skillsets);
    this.user.controls['id'].setValue(usr.id);
  }

  save(modal:any): void{
    console.log(this.user);
    this.formValid = true;
    if(this.user.controls['email'].invalid){
      this.emailInvalid = true;
    }
    if(this.user.invalid){
      this.formValid = false;
      return;
    }

    this.userDto.email = this.user.value.email;
    this.userDto.hobby = this.user.value.hobby;
    this.userDto.phone = this.user.value.phone;
    this.userDto.skillsets = this.user.value.skillsets;
    this.userDto.username = this.user.value.username;

    this.employeeService.addUser(this.userDto).subscribe({
      next: (v) => {
        console.log("heeeee");
        this.modalService.dismissAll(modal);
        this.getAllUser();
      },
      error: (e) => console.log(e),
      complete: () => console.info('complete')
    })
    //this.modalService.dismissAll(modal);
  }

  getAllUser(){
    this.loadingTable = true;
    this.employeeService.getAllUser().subscribe({
      next: (v) => {
        this.userList = v
      },
      error: (e) => console.log(e),
      complete: () => this.loadingTable = false
    })
  }

  updateUser(model: any): void{
    this.userObj.id = this.user.value.id;
    this.userObj.username = this.user.value.username;
    this.userObj.email = this.user.value.email;
    this.userObj.hobby = this.user.value.hobby;
    this.userObj.phone = this.user.value.phone;
    this.userObj.skillsets = this.user.value.skillsets;

    this.employeeService.updateUser(this.userObj).subscribe({
      next: (v) => this.getAllUser(),
      error: (e) => console.log(e),
      complete: () => this.modalService.dismissAll(model)
    })
  }

  confirmModalOpen(modal: any, usr: User):void {
    this.modalService.open(modal);
    this.user.controls['id'].setValue(usr.id);
  }

  deleteUser(modal: any):void{
    this.employeeService.deleteUser(this.user.value.id).subscribe({
      next: (v) => this.getAllUser(),
      error: (e) => console.log(e),
      complete: () => this.modalService.dismissAll(modal)
    })
  }

}
