"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
// Statics
require('rxjs/add/observable/throw');
// Operators
require('rxjs/add/operator/catch');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/map');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/toPromise');
var TaskModel = (function () {
    function TaskModel(title, completed, created_at, updated_at) {
        if (title === void 0) { title = ""; }
        if (completed === void 0) { completed = false; }
        if (created_at === void 0) { created_at = new Date(); }
        if (updated_at === void 0) { updated_at = new Date(); }
        this.title = title;
        this.completed = completed;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    return TaskModel;
}());
exports.TaskModel = TaskModel;
var TaskService = (function () {
    function TaskService(_http) {
        this._http = _http;
    }
    TaskService.prototype.getTasks = function () {
        var _this = this;
        // Set a promise...
        var aPromise = this._http.get('tasks.json')
            .map(function (response) { return response.json().data; })
            .toPromise()
            .catch(this.handleError);
        // Promise fulfilled, then:
        aPromise.then(function (tasks) {
            console.log("Then:", tasks);
            _this.tasks = tasks;
        });
    };
    TaskService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    TaskService.prototype.complete = function (task) {
        task.completed = task.completed ? false : true;
    };
    TaskService.prototype.removeTask = function (task) {
        if (this.selectedTask == task) {
            this.selectedTask = null;
        }
        ;
        var i = this.tasks.indexOf(task);
        this.tasks.splice(i, 1);
    };
    TaskService.prototype.create = function (task) {
        this.tasks = this.tasks.concat([task]);
    };
    TaskService.prototype.selectTask = function (task) {
        if (task === void 0) { task = null; }
        this.selectedTask = task;
    };
    TaskService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TaskService);
    return TaskService;
}());
exports.TaskService = TaskService;
// ===================================================================================
var TaskNewComponent = (function () {
    function TaskNewComponent(taskService) {
        this.taskService = taskService;
        this.task = new TaskModel();
    }
    TaskNewComponent.prototype.onSubmit = function () {
        // this.taskService.tasks.push(this.task);
        this.taskService.create(this.task);
        this.task = new TaskModel();
    };
    TaskNewComponent = __decorate([
        core_1.Component({
            selector: 'task-new',
            template: "\n  <div class=\"row\">\n    <h4>Task New</h4>\n    <form (submit)=\"onSubmit()\">\n      <input [(ngModel)]=\"task.title\">\n      <input type=\"submit\">\n    </form>\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [TaskService])
    ], TaskNewComponent);
    return TaskNewComponent;
}());
exports.TaskNewComponent = TaskNewComponent;
// ===================================================================================
var TaskDetailsComponent = (function () {
    function TaskDetailsComponent(taskService) {
        this.taskService = taskService;
        this.num = "";
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', TaskModel)
    ], TaskDetailsComponent.prototype, "task", void 0);
    TaskDetailsComponent = __decorate([
        core_1.Component({
            selector: 'task-details',
            template: "\n  <div *ngIf=\"task\" class=\"col-xs-4\">\n    <hr>\n    <input [(ngModel)]=\"task.title\">\n    <button (click)=\"taskService.selectTask()\">Done</button>\n    <hr>\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [TaskService])
    ], TaskDetailsComponent);
    return TaskDetailsComponent;
}());
exports.TaskDetailsComponent = TaskDetailsComponent;
// ===================================================================================
var TaskListComponent = (function () {
    function TaskListComponent(taskService) {
        this.taskService = taskService;
    }
    TaskListComponent.prototype.ngOnInit = function () { this.getTasks(); };
    TaskListComponent.prototype.getTasks = function () {
        this.taskService.getTasks();
    };
    TaskListComponent = __decorate([
        core_1.Component({
            selector: 'task-list',
            directives: [TaskDetailsComponent],
            template: "\n  <div class=\"row\">\n    <h4 [class.red]=\"true\">Task List</h4>\n    <ul>\n      <li *ngFor=\"let task of taskService.tasks\">\n        <span (click)=\"taskService.selectTask(task)\">{{task.title}}</span>\n        <div [ngSwitch]=\"task.completed\">\n          <span *ngSwitchWhen=\"true\">Completed</span>\n          <span *ngSwitchWhen=\"false\">Incomplete</span>\n        </div>\n        <button (click)=\"taskService.complete(task)\" [ngStyle]=\"{'font-size': '12px', color: 'green'}\" >Complete</button>\n        <button (click)=\"taskService.removeTask(task)\" [ngClass]=\"{red: true}\">Remove</button>\n      </li>\n      <task-details *ngIf=\"taskService.selectedTask\" [task]=\"taskService.selectedTask\"></task-details>\n    </ul>\n  </div>\n  ",
            styles: [".red { color: red; }"]
        }), 
        __metadata('design:paramtypes', [TaskService])
    ], TaskListComponent);
    return TaskListComponent;
}());
exports.TaskListComponent = TaskListComponent;
// ===================================================================================
var TasksComponent = (function () {
    function TasksComponent() {
    }
    TasksComponent = __decorate([
        core_1.Component({
            selector: 'tasks',
            directives: [TaskNewComponent, TaskListComponent],
            styles: [],
            template: "\n    <h3>Tasks</h3>\n    <task-new></task-new>\n    <task-list></task-list>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TasksComponent);
    return TasksComponent;
}());
exports.TasksComponent = TasksComponent;
// ===================================================================================
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            directives: [TasksComponent],
            providers: [TaskService],
            template: "\n  <div class=\"container\">\n    <tasks></tasks>\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
platform_browser_dynamic_1.bootstrap(AppComponent, [http_1.HTTP_PROVIDERS]);
//# sourceMappingURL=main.js.map