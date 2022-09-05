# Diagnostic / Initial assessment
Students can pick a level and take a test. Chapters get graded, but this information gets lost if they start a new diagnostic. Overall rating is also calculated.

## Levels
Currently: there are not enough questions to really make the diagnostics effective. 

Questions are sorted according to rating bands. These can be seen in the topicLevels.js file. 

This is a very rough way of selecting questions, but it has the benefit that it is automatic. 
It does mean that some simple percentage questions end up in the FS E3 diagnostic, but I don't think this is a big problem. You need some L1 questions in order to spot the students who should move to level 1. And similarly: some algebra questions end up being in the L1 diagnostic.

## Ratings
The question ratings are set so that every 100 points is roughly a grade of the 1-9 GCSE scale. 
I set them by hand in the math-q-factory project. Ideally: I would use feedback from students getting questions right or wrong to modify these ratings. But I have put that on hold for now.

Similarly: the rating of the student tries to reflect the grade. There aren't enough questions at a high level for a student to get to a rating of 400 on the GCSE diagnostic -- even if they get all the questions correct. This will change as more questions are added.

A ratings change is calculated in a manner adapted from the chess ELO system. If a question has a much lower rating than you, then you should get it right. If you do: your rating changes only a little. More surprising results lead to a bigger change in rating. At the moment: the most your rating can change in one question is 32.

Overall rating is kept track of, calculated from 'matches' with every question answered by inputing an answer. (Worksheet reveals don't count!)
But this could be gamed by repeating the questions and topics you are good at. So another measure is average topic rating. To pass an exam, you would need a high rating in a variety of topics. Getting this requires that you complete a topic more than once. No chapter has enough questions to take it to 400 in one pass.

## Taking the diagnostic
Students can pick which chapter to work on. Questions from that chapter are ordered by rating. 
The computer starts in the middle of the list. 
If the student gets a question correct if jumps to a tougher question, otherwise it jumps to an easier question.

Progress is saved only when a chapter of the diagnostic is finished. However: the ratings can be influenced by all answered questions, even if a chapter is restated more than once.

## Result history
Only title, date and average chapter rating are saved in the diagnostic history. This stays in the database, but current results are over-written if the student changes level or retakes a completed diagnostic. (Or that is the plan. Currently results are deleted when you leave a completed diagnostic).
