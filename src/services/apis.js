const BASE_URL = process.env.REACT_APP_API_URL


export const authEndpoints = {
    REGISTER_API: BASE_URL + "/auth/register",
    LOGIN_API: BASE_URL + "/auth/login"
}

export const assignmentEndpoints = {
    GET_ALL_ASSIGNMENT_API : BASE_URL + "/utils/assignments",
    DELETE_ASSIGNMENT_API : BASE_URL + "/utils/assignments",
    CREATE_ASSIGNMENT_API : BASE_URL + "/utils/assignments"
}

export const noteEndpoints = {
    GET_ALL_NOTE_API : BASE_URL + "/utils/notes",
    DELETE_NOTE_API : BASE_URL + "/utils/notes",
    CREATE_NOTE_API : BASE_URL + "/utils/notes"
}

export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/auth/getUserDeatils",
}

export const analyticsEndpoints = {
    GET_CLASS_ANALYTICS_API: BASE_URL + "/analytics/getClassAnalytics",
    GET_FINANCIAL_ANALYTICS_API : BASE_URL + "/analytics/getFinancialAnalytics"
}

export const classEndpoints = {
    GET_ALL_CLASS_API : BASE_URL + "/class",
    DELETE_CLASS_API : BASE_URL + "/class",
    CREATE_CLASS_API : BASE_URL + "/class",
    UPDATE_CLASS_API : BASE_URL + "/class",
    GET_CLASS_BY_ID_API : BASE_URL + "/class"
}

export const studentEndpoints = {
    GET_ALL_STUDENT_API : BASE_URL + "/student",
    GET_STUDENT_BY_ID_API : BASE_URL + "/student",
    UPDATE_STUDENT_API : BASE_URL + "/student",
    DELETE_STUDENT_API : BASE_URL + "/student",
    CREATE_STUDENT_API : BASE_URL + "/student"
}

export const teacherEndpoints = {
    GET_ALL_TEACHER_API : BASE_URL + "/teacher",
    GET_TEACHER_BY_ID_API : BASE_URL + "/teacher",
    UPDATE_TEACHER_API : BASE_URL + "/teacher",
    DELETE_TEACHER_API : BASE_URL + "/teacher",
    CREATE_TEACHER_API : BASE_URL + "/teacher"
}
