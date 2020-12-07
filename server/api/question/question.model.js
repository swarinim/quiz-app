'use strict';

import mongoose from 'mongoose';

var QuestionSchema = new mongoose.Schema({
  question: String,
  correctAnswer: String,
  options: [String],
  photo: String,
  desc: String,
  active: Boolean
});

export default mongoose.model('Question', QuestionSchema);
