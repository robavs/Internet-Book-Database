import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reader-interface',
  templateUrl: './reader-interface.component.html',
  styleUrls: ['./reader-interface.component.css'],
  standalone: true,
  imports: [ReaderInterfaceComponent, NavbarComponent]
})
export class ReaderInterfaceComponent {

}
