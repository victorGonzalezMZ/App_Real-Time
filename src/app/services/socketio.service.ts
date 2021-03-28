import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(private socket: Socket) {
    this.checkStatus();
  }

  statusConnect: boolean = false;

  on(eventName: string) {
    return this.socket.fromEvent(eventName).pipe(map((data:any)=>data));
  }

  emit(eventName: string, payload: any) {
    this.socket.emit(eventName, payload);
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al Servidor de Sockets');
      this.statusConnect = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Se ha desconectado del Servidor de Sockets');
      this.statusConnect = false;
    });
  }

}
