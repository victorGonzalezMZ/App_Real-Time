import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketioService } from './services/socketio.service';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'my app';
  suscription$: Subscription;

  listaUsuarios: any[] = [];

  constructor(public socket: SocketioService, private authSvc: AuthService) {
    this.suscription$ = this.socket.on('returnUserSignIn').subscribe((user: any) => {
      this.socket.emit('passwordSetup', {
        email: user.correo,
        password: '123Ejemplo',
        apiKey: environment.API_KEY
      });
    });

    this.suscription$ = this.socket.on('finishSignIn').subscribe((result: any) => {
      console.log(result[0].user);
      console.log(result[0].token.token);
    });
  }

  ngOnInit() {

  }

  loginOAuth2(provider: string) {
    this.authSvc.loginOAuth2(provider)
    .then((user: any) => {
      this.socket.emit('signUp', {
        fullName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        apiKey: environment.API_KEY
      });
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
  }

  sendMessage(msg: string) {
    console.log(msg);
    this.socket.emit('message', {
      client: 'Angular', msg
    });
  }

  ngOnDestroy(): void {
    this.suscription$.unsubscribe();
  }
}
