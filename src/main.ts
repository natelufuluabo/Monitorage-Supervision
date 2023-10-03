type student = { name: string, studentId: number }
type exam = { examId: number, maxGrade: number, weight: number, name: string }
type grade = { studentId: number, examId: number, grade: number }
type data = { students: student[], exams: exam[], grades: grade[] }
type studentGrade = { name: string, studentId: number, grade: number }

const getData = async () => {
    const json = await fetch("https://didier-ahuntsic.gitlab.io/cours-420-317-ah/data/grades.json")
    const data: data = await json.json();
    const studentsData: student[] = data.students;
    const examsData: exam[] = data.exams;
    const gradesData: grade[] = data.grades;

    const studentsGrades: studentGrade[] = []
    for (const student of studentsData) {
        let finalGrade = 0;
        const grades: grade[] = gradesData.filter((grade) => grade.studentId === student.studentId);
        for (const grade of grades) {
            for (const exam of examsData) {
                if (grade.examId === exam.examId) {
                    const tempGrade = grade.grade / exam.maxGrade
                    finalGrade += (tempGrade * exam.weight)
                }
            }
        }
        studentsGrades.push({ ...student, grade: Math.ceil(finalGrade) })
    }
    console.log(studentsGrades);
}

const countCity = async () => {
    const json = await fetch("https://didier-ahuntsic.gitlab.io/cours-420-317-ah/data/cities.json")
    const data = await json.json();
    const newMap = new Map<string, number>();
    for (let i = 0; i < data.length; i++) {
        if (!newMap.has(data[i])) {
            newMap.set(data[i], 1)
        } else {
            newMap.set(data[i], newMap.get(data[i]) + 1)
        }
    }
}

countCity();
