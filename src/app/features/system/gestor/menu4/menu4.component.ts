import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService, Paciente } from '../paciente.service';
import { UsuarioService, Usuario } from '../usuario.service';

@Component({
  selector: 'app-menu4',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu4.component.html',
  styleUrl: './menu4.component.css'
})
export class Menu4Component implements OnInit {
  weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  calendarDays: any[] = [];
  pacientes: Paciente[] = [];
  cuidadores: Usuario[] = [];
  filtroCuidador: string = '';

  // Store calendar data for each caregiver
  private calendarsData: { [cuidadorName: string]: any[] } = {};
  private readonly STORAGE_KEY = 'calendars_data';

  // Conflict modal
  modalConflictOpen: boolean = false;
  conflictMessage: string = '';
  conflictCuidador: string = '';

  constructor(
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.pacienteService.getPacientes().subscribe(data => {
      this.pacientes = data;
    });

    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.cuidadores = usuarios.filter(u => u.role === 'Caregiver');

      // Load saved calendars data
      this.loadCalendarsData();

      // Set first caregiver as default if available
      if (this.cuidadores.length > 0) {
        this.filtroCuidador = this.cuidadores[0].userName;
        this.loadCalendarForCuidador(this.filtroCuidador);
      } else {
        this.generateCalendar();
      }
    });
  }

  loadCalendarsData(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.calendarsData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading calendars data:', error);
    }
  }

  saveCalendarsData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.calendarsData));
    } catch (error) {
      console.error('Error saving calendars data:', error);
    }
  }

  onCuidadorChange(): void {
    if (this.filtroCuidador) {
      // Save current calendar before switching
      if (this.calendarDays.length > 0) {
        const previousCuidador = Object.keys(this.calendarsData).find(
          key => this.calendarsData[key] === this.calendarDays
        );
        if (previousCuidador) {
          this.calendarsData[previousCuidador] = [...this.calendarDays];
        }
      }

      this.loadCalendarForCuidador(this.filtroCuidador);
      this.saveCalendarsData();
    }
  }

  loadCalendarForCuidador(cuidadorName: string): void {
    if (this.calendarsData[cuidadorName]) {
      this.calendarDays = this.calendarsData[cuidadorName];
    } else {
      this.generateCalendar();
      this.calendarsData[cuidadorName] = this.calendarDays;
      this.saveCalendarsData();
    }
  }

  generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Get number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the weekday of the 1st of the month (0=Sunday, 1=Monday, ...)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Adjust because our week starts on Monday (index 0) but Date.getDay() returns 0 for Sunday
    // Mon(1)->0, Tue(2)->1 ... Sun(0)->6
    const offset = (firstDayIndex + 6) % 7;

    this.calendarDays = [];

    // Add empty slots for days before the 1st
    for (let i = 0; i < offset; i++) {
      this.calendarDays.push({ number: null, events: [] });
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      let events: string[] = [];
      this.calendarDays.push({
        number: i,
        events: events,
        selectedPatients: [''], // Initialize with one empty selection
        selectedShifts: [''] // Initialize shift selection for each patient
      });
    }
  }

  addSelection(day: any) {
    day.selectedPatients.push('');
    day.selectedShifts.push('');

    // Save after adding selection
    if (this.filtroCuidador) {
      this.calendarsData[this.filtroCuidador] = [...this.calendarDays];
      this.saveCalendarsData();
    }
  }

  removeSelection(day: any, index: number) {
    day.selectedPatients.splice(index, 1);
    day.selectedShifts.splice(index, 1);

    if (this.filtroCuidador) {
      this.calendarsData[this.filtroCuidador] = [...this.calendarDays];
      this.saveCalendarsData();
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  isPatientSelected(day: any, patientName: string, currentIndex: number): boolean {
    return day.selectedPatients.some((selectedName: string, index: number) =>
      selectedName === patientName && index !== currentIndex
    );
  }

  onSelectionChange(): void {
    // Save calendar data whenever a selection changes
    if (this.filtroCuidador) {
      this.calendarsData[this.filtroCuidador] = [...this.calendarDays];
      this.saveCalendarsData();
    }
  }

  // Check if two shifts overlap
  shiftsOverlap(shift1: string, shift2: string): boolean {
    if (!shift1 || !shift2) return false;

    // Same shift always overlaps
    if (shift1 === shift2) return true;

    // Different 24h shifts don't overlap (one starts at 7h, other at 19h)
    if (shift1.startsWith('24H') && shift2.startsWith('24H')) {
      return false; // 24H_7H and 24H_19H are different shifts
    }

    // 24H_7H overlaps with MT (7h-19h) but not with SN (19h-7h)
    if (shift1 === '24H_7H' && shift2 === 'MT') return true;
    if (shift1 === 'MT' && shift2 === '24H_7H') return true;

    if (shift1 === '24H_7H' && shift2 === 'SN') return false;
    if (shift1 === 'SN' && shift2 === '24H_7H') return false;

    // 24H_19H overlaps with SN (19h-7h) but not with MT (7h-19h)
    if (shift1 === '24H_19H' && shift2 === 'SN') return true;
    if (shift1 === 'SN' && shift2 === '24H_19H') return true;

    if (shift1 === '24H_19H' && shift2 === 'MT') return false;
    if (shift1 === 'MT' && shift2 === '24H_19H') return false;

    // MT and SN don't overlap
    if ((shift1 === 'MT' && shift2 === 'SN') || (shift1 === 'SN' && shift2 === 'MT')) {
      return false;
    }

    return false;
  }

  // Check if a patient is already assigned to another caregiver at the same time
  // Returns the name of the conflicting caregiver or null if available
  getConflictingCuidador(dayNumber: number, patientName: string, shift: string, currentCuidador: string): string | null {
    if (!patientName || !shift || !dayNumber) return null;

    // Check all other caregivers' calendars
    for (const cuidadorName in this.calendarsData) {
      // Skip current caregiver
      if (cuidadorName === currentCuidador) continue;

      const calendar = this.calendarsData[cuidadorName];
      const day = calendar.find(d => d.number === dayNumber);

      if (day) {
        // Check all selections in this day
        for (let i = 0; i < day.selectedPatients.length; i++) {
          const selectedPatient = day.selectedPatients[i];
          const selectedShift = day.selectedShifts[i];

          // If same patient and shifts overlap, there's a conflict
          if (selectedPatient === patientName && this.shiftsOverlap(shift, selectedShift)) {
            return cuidadorName;
          }
        }
      }
    }

    return null;
  }

  // Validate selection and show modal if conflict exists
  validateSelection(dayNumber: number, patientName: string, shift: string): boolean {
    const conflictingCuidador = this.getConflictingCuidador(dayNumber, patientName, shift, this.filtroCuidador);

    if (conflictingCuidador) {
      // Find the full caregiver object to get both name and surname
      const cuidador = this.cuidadores.find(c => c.userName === conflictingCuidador);
      const fullName = cuidador
        ? `${cuidador.userName} ${cuidador.sobrenome || ''}`.trim()
        : conflictingCuidador;

      this.conflictCuidador = fullName;
      this.conflictMessage = `O paciente "${patientName}" já está agendado com o cuidador "${fullName}" neste horário.`;
      this.modalConflictOpen = true;
      return false;
    }
    return true;
  }

  // Called when patient or shift changes
  onPatientOrShiftChange(day: any, index: number): void {
    const patient = day.selectedPatients[index];
    const shift = day.selectedShifts[index];

    // Check if the caregiver already has an overlapping shift on this day
    if (shift) {
      for (let i = 0; i < day.selectedShifts.length; i++) {
        if (i === index) continue; // Skip current row
        const otherShift = day.selectedShifts[i];

        if (otherShift && this.shiftsOverlap(shift, otherShift)) {
          this.conflictMessage = `O cuidador já possui um agendamento neste horário no dia ${day.number}.`;
          this.modalConflictOpen = true;

          // Clear the invalid shift but keep the patient if selected
          day.selectedShifts[index] = '';
          this.onSelectionChange();
          return;
        }
      }
    }

    // Only validate if both patient and shift are selected
    if (patient && shift) {
      if (!this.validateSelection(day.number, patient, shift)) {
        // Clear the conflicting selection
        day.selectedPatients[index] = '';
        day.selectedShifts[index] = '';
      }
    }

    this.onSelectionChange();
  }

  closeConflictModal(): void {
    this.modalConflictOpen = false;
    this.conflictMessage = '';
    this.conflictCuidador = '';
  }

  isDayPast(dayNumber: number): boolean {
    if (!dayNumber) return false;
    const now = new Date();
    // Assuming the calendar is always for the current month/year as implemented in generateCalendar
    return dayNumber < now.getDate();
  }
}
