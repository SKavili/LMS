
require('dotenv').config({ path: '.env' }).parsed;

const express = require('express');
const bodyParser = require('body-parser');
const setupSwagger = require('./swagger');
const morgan = require('morgan');
const logger = require('./logger');
const PORT = process.env.PORT;
const app = express();
const cors = require("cors");
app.use(cors());
app.use('/files', express.static('files'));
const roleRoutes = require('./routes/roles');
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const companyRoutes = require('./routes/companies');
const courseRoutes = require('./routes/courses');
const tDRoutes = require('./routes/trainingDetails');
const attendanceRoutes = require('./routes/attendance');
const testMasterRoutes = require('./routes/testMaster');
const materialRoutes = require('./routes/material');
const stDocRoutes = require('./routes/studentsDocuments');
const testAnswScorRoutes = require('./routes/testAnswersAndScore');
const reportRoutes = require('./routes/reports');
const studentTrainingRoutes = require('./routes/studentTrainings');
const otherRoutes = require('./routes/others');
const StandupNotesRoutes=require('./routes/standupNotes')
// Setup Morgan to use Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.use(bodyParser.json());
setupSwagger(app);

app.listen(PORT,'0.0.0.0',() => {
    console.log(`server is running on porth ${PORT}`);
});

app.use('/', loginRoutes);
app.use('/roles', roleRoutes);
app.use('/companies', companyRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/training_details', tDRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/test-master', testMasterRoutes);
app.use('/materials', materialRoutes);
app.use('/student_documents', stDocRoutes);
app.use('/test-answers-score', testAnswScorRoutes);
app.use('/reports', reportRoutes);
app.use('/student_trainings', studentTrainingRoutes);
app.use('/others', otherRoutes);
app.use('/standupNotes',StandupNotesRoutes)
