'use strict';

export default class AdminController {
  newQuestion = {};
  questions =[];
  /*@ngInject*/
  constructor(User, $scope, socket, $http) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.$http = $http;
    this.socket = socket;
    this.$http.get('/api/questions')
      .then(response => {
        this.questions = response.data;
        this.socket.syncUpdates('question', this.questions);
      });
    $scope.file_changed = function(element) {
             var photofile = element.files[0];
             var reader = new FileReader();
             reader.onload = function(e) {
               $scope.admin.newQuestion.photo = e.target.result;
             };
             reader.readAsDataURL(photofile);
    };
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('question');
    });
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  deleteThing(question) {
    this.$http.delete(`/api/questions/${question._id}`);
  }

  addThing(form) {
    function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
    }
    if(this.newQuestion && form.$valid) {
      this.newQuestion.options = this.newQuestion.options.split(',');
      this.newQuestion.options.push(this.newQuestion.correctAnswer);
      this.newQuestion.options = shuffle(this.newQuestion.options);
      this.$http.post('/api/questions', this.newQuestion);
      this.newQuestion = {};
    }
  }
}
