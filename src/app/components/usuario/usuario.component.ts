import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  isLoading = false;
  errorMessage = '';
  showPopup = false;

  newUsuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    genero: ''
  };

  constructor(private apiService: ApiService) { }

  private getUsuarioId(usuario: Usuario | null): string | undefined {
    if (!usuario) {
      return undefined;
    }
    return usuario._id ?? usuario.id;
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data.map((usuario) => ({
          ...usuario,
          _id: usuario._id ?? usuario.id
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = 'Error al cargar los datos. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  saveObject(): void {
    if (!this.newUsuario.nombre || !this.newUsuario.apellido || !this.newUsuario.email || !this.newUsuario.genero) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.apiService.create(this.newUsuario).subscribe({
      next: (newUsuario) => {
        this.loadUsuarios();
        this.clearNewUsuarioForm();
        alert('Usuario agregado exitosamente');
      },
      error: (error) => {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar el usuario');
      }
    });
  }

  editUsuario(usuario: Usuario): void {
    const id = this.getUsuarioId(usuario);
    this.selectedUsuario = {
      _id: id,
      id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      genero: usuario.genero
    };
    this.showPopup = true;
  }

  updateObject(): void {
    if (!this.selectedUsuario) {
      alert('No hay usuario seleccionado para actualizar');
      return;
    }

    const id = this.getUsuarioId(this.selectedUsuario);

    if (!id) {
      alert('El usuario no tiene ID válido');
      return;
    }

    if (!this.selectedUsuario.nombre || !this.selectedUsuario.apellido || !this.selectedUsuario.email || !this.selectedUsuario.genero) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.apiService.update(id, this.selectedUsuario).subscribe({
      next: (response) => {
        this.loadUsuarios();
        this.closePopup();
        alert('Usuario actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        alert(`Error al actualizar el usuario: ${error.message || 'Error desconocido'}`);
      }
    });
  }

  deleteUsuario(usuario: Usuario): void {
    const id = this.getUsuarioId(usuario);

    if (!id) {
      alert('El usuario no tiene ID válido');
      return;
    }

    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.apiService.delete(id).subscribe({
        next: () => {
          this.loadUsuarios();
          alert('Usuario eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  clearNewUsuarioForm(): void {
    this.newUsuario = {
      nombre: '',
      apellido: '',
      email: '',
      genero: ''
    };
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedUsuario = null;
  }
}
