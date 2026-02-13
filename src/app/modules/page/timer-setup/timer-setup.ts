import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sectionsSignal, Section } from '../chronometer/sections';

@Component({
  selector: 'app-timer-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timer-setup.html',
  styleUrls: ['./timer-setup.css']
})
export class TimerSetupComponent {
  // Form for managing sections
  sectionForm = new FormGroup({
    text: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    hours: new FormControl('00', { validators: [Validators.required], nonNullable: true }),
    minutes: new FormControl('05', { validators: [Validators.required], nonNullable: true }),
    seconds: new FormControl('00', { validators: [Validators.required], nonNullable: true })
  });

  errorMessage = signal('');
  successMessage = signal('');
  sections = sectionsSignal.asReadonly();
  editingIndex = signal<number | null>(null);

  constructor(private router: Router) {}

  // Methods for managing sections
  onSectionSubmit(): void {
    if (this.sectionForm.invalid) {
      this.errorMessage.set('Por favor complete todos los campos de la sección.');
      return;
    }

    const text = this.sectionForm.value.text || '';
    const hours = String(this.sectionForm.value.hours || '00').padStart(2, '0');
    const minutes = String(this.sectionForm.value.minutes || '00').padStart(2, '0');
    const seconds = String(this.sectionForm.value.seconds || '00').padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    // Validate time format
    if (!this.isValidTimeString(timeString)) {
      this.errorMessage.set('Formato de tiempo inválido. Use HH:MM:SS.');
      return;
    }

    const newSection: Section = { text, time: timeString };

    if (this.editingIndex() !== null) {
      // Update existing section - ensure we're creating a new array
      const currentSections = [...this.sections()];
      currentSections[this.editingIndex()!] = newSection;
      sectionsSignal.set([...currentSections]); // Create a new array reference
      this.successMessage.set('Sección actualizada correctamente.');
      this.editingIndex.set(null);
    } else {
      // Add new section - ensure we're creating a new array
      const currentSections = [...this.sections()];
      sectionsSignal.set([...currentSections, newSection]); // Create a new array reference
      this.successMessage.set('Sección agregada correctamente.');
    }

    console.log('Secciones actuales:', this.sections());
    // Reset form
    this.sectionForm.reset();
    this.sectionForm.patchValue({
      hours: '00',
      minutes: '05',
      seconds: '00'
    });
  }

  editSection(index: number): void {
    const section = this.sections()[index];
    const [hours, minutes, seconds] = section.time.split(':');
    
    this.sectionForm.patchValue({
      text: section.text,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    });
    
    this.editingIndex.set(index);
    this.successMessage.set('Editando sección. Complete el formulario y guárdelo.');
  }

  deleteSection(index: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta sección?')) {
      sectionsSignal.update(sections => {
        const newSections = [...sections];
        newSections.splice(index, 1);
        return newSections;
      });
      this.successMessage.set('Sección eliminada correctamente.');
      
      // Clear any editing state if we deleted the currently edited item
      if (this.editingIndex() === index) {
        this.cancelEdit();
      }
    }
  }

  cancelEdit(): void {
    this.sectionForm.reset();
    this.sectionForm.patchValue({
      hours: '00',
      minutes: '05',
      seconds: '00'
    });
    this.editingIndex.set(null);
    this.successMessage.set('Edición cancelada.');
  }

  // Method to navigate to the chronometer page
  goToChronometer(): void {
    this.router.navigate(['/chronometer']);
  }

  private isValidTimeString(timeString: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return regex.test(timeString);
  }
}
