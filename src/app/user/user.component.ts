import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
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

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private employeeService: UserService) { }

  ngOnInit(): void {
    this.user = this.formBuilder.group({
      id: [''],
      username: ['ridzaq'],
      email: ['ridzaq09@gmail.com'],
      phone: ['0166509221'],
      skillsets: ['test'],
      hobby: ['sfdsdfs']
    })

    this.getAllUser();
  }

  public open(modal: any): void {
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

    this.userDto.email = this.user.value.email;
    this.userDto.hobby = this.user.value.hobby;
    this.userDto.phone = this.user.value.phone;
    this.userDto.skillsets = this.user.value.skillsets;
    this.userDto.username = this.user.value.username;

    this.employeeService.addUser(this.userDto).subscribe({
      next: (v) => {
        this.modalService.dismissAll(modal);
        this.getAllUser();
      },
      error: (e) => console.log(e),
      complete: () => console.info('complete')
    })
    //this.modalService.dismissAll(modal);
  }

  getAllUser(){
    this.employeeService.getAllUser().subscribe({
      next: (v) => this.userList = v,
      error: (e) => console.log(e),
      complete: () => console.info('complete')
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
