import { bootstrap } from '@angular/platform-browser-dynamic';
import { Component, Input, Injectable, OnInit } from '@angular/core';
import { HTTP_PROVIDERS, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// Statics
import 'rxjs/add/observable/throw';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

export class TaskModel {
    constructor(
        public title: string = "",
        public completed: boolean = false,
        public created_at: Date = new Date(),
        public updated_at: Date = new Date()) { }
}

@Injectable()
export class TaskService {
    tasks: Array<TaskModel>;
    tasksPromise: Promise<any[]>;

    selectedTask: any;

    constructor(private _http: Http) { }

    getTasks() {
        // Set a promise...
        var aPromise = this._http.get('tasks.json')
        .map((response: Response) => response.json().data)
        .toPromise()
        .catch(this.handleError)
        // Promise fulfilled, then:
        aPromise.then(tasks => {
            console.log("Then:", tasks)
            this.tasks = tasks;
        });
     
    }


    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
    complete(task: any) {
        task.completed = task.completed ? false : true;
    }

    removeTask(task: any): void {

        if(this.selectedTask == task){ this.selectedTask = null; }; 
        const i = this.tasks.indexOf(task);
        this.tasks.splice(i,1);


    }

    create(task: any) {
        this.tasks = [...this.tasks, task];

    }

    selectTask(task: TaskModel = null) {
        this.selectedTask = task;
    }
}
// ===================================================================================
@Component({
    selector: 'task-new',
    template: `
  <div class="row">
    <h4>Task New</h4>
    <form (submit)="onSubmit()">
      <input [(ngModel)]="task.title">
      <input type="submit">
    </form>
  </div>
  `
})
export class TaskNewComponent {
    task: TaskModel;

    constructor(public taskService: TaskService) {
        this.task = new TaskModel();
    }

    onSubmit() {
        // this.taskService.tasks.push(this.task);
        this.taskService.create(this.task);
        this.task = new TaskModel();
    }
}
// ===================================================================================
@Component({
    selector: 'task-details',
    template: `
  <div *ngIf="task" class="col-xs-4">
    <hr>
    <input [(ngModel)]="task.title">
    <button (click)="taskService.selectTask()">Done</button>
    <hr>
  </div>
  `
})
export class TaskDetailsComponent {
    @Input() task: TaskModel;
    num = "";

    constructor(
        public taskService: TaskService) { }
}
// ===================================================================================

@Component({
    selector: 'task-list',
    directives: [TaskDetailsComponent],
    template: `
  <div class="row">
    <h4 [class.red]="true">Task List</h4>
    <ul>
      <li *ngFor="let task of taskService.tasks">
        <span (click)="taskService.selectTask(task)">{{task.title}}</span>
        <div [ngSwitch]="task.completed">
          <span *ngSwitchWhen="true">Completed</span>
          <span *ngSwitchWhen="false">Incomplete</span>
        </div>
        <button (click)="taskService.complete(task)" [ngStyle]="{'font-size': '12px', color: 'green'}" >Complete</button>
        <button (click)="taskService.removeTask(task)" [ngClass]="{red: true}">Remove</button>
      </li>
      <task-details *ngIf="taskService.selectedTask" [task]="taskService.selectedTask"></task-details>
    </ul>
  </div>
  `,
  styles: [".red { color: red; }"]
})
export class TaskListComponent {
    errorMessage: string;
    tasks: Promise<TaskModel[]>;

    constructor(
        public taskService: TaskService) { }

    ngOnInit() { this.getTasks(); }

    getTasks() {
        this.taskService.getTasks();
    }
}
// ===================================================================================

@Component({
    selector: 'tasks',
    directives: [TaskNewComponent, TaskListComponent],
    styles: [],
    template: `
    <h3>Tasks</h3>
    <task-new></task-new>
    <task-list></task-list>
  `
})
export class TasksComponent {

}

// ===================================================================================

@Component({
    selector: 'my-app',
    directives: [TasksComponent],
    providers: [TaskService],
    template: `
  <div class="container">
    <tasks></tasks>
  </div>
  `
})
export class AppComponent {

}

bootstrap(AppComponent, [HTTP_PROVIDERS]);