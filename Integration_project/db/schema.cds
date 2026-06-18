namespace eventmanager;

type UserRole : String enum {
    user;
    admin;
}

entity Users {
    key ID          : UUID;
    firstName       : String(100);
    lastName        : String(100);
    email           : String(100);
    password        : String(100);
    role            : UserRole default 'user';
    xsuaaId         : String(255);

    registrations   : Composition of many Registrations
                      on registrations.user = $self;
}

entity Events {
    key ID          : UUID;
    name            : String(100);
    description     : String(500);
    location        : String(100);
    startDate       : Timestamp;
    endDate         : Timestamp;
    active          : Boolean default true;

    sessions        : Composition of many Sessions
                      on sessions.event = $self;
}

entity Sessions {
    key ID          : UUID;
    title           : String(100);
    description     : String(500);
    startTime       : Timestamp;
    endTime         : Timestamp;
    speaker         : String(100);
    room            : String(50);
    capacity        : Integer;

    event           : Association to Events;

    registrations   : Composition of many Registrations
                      on registrations.session = $self;
}

entity Registrations {
    key ID                  : UUID;
    registrationDate        : Timestamp;
    attendanceConfirmed     : Boolean default false;

    session                 : Association to Sessions;
    user                    : Association to Users;

    feedback                : Composition of many Feedback
                              on feedback.registration = $self;
}

entity Feedback {
    key ID          : UUID;
    score           : Integer;
    comment         : String(500);
    submittedAt     : Timestamp;
    email           : String(100);

    registration    : Association to Registrations;
}
