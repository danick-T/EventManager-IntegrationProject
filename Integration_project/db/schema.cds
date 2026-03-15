namespace eventmanager;

entity Events {
    key ID          : UUID;
    name            : String(100);
    description     : String(500);
    location        : String(100);
    date            : Date;
    active          : Boolean;
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
    event           : Association to Events;
    registrations   : Composition of many Registrations
                      on registrations.session = $self;
    feedback        : Composition of many Feedback
                      on feedback.session = $self;
}

entity Registrations {
    key ID          : UUID;
    userName        : String(100);
    email           : String(100);
    session         : Association to Sessions;
    registeredAt    : Timestamp;
}

entity Feedback {
    key ID          : UUID;
    rating          : Integer;
    comment         : String(500);
    userName        : String(100);
    session         : Association to Sessions;
    createdAt       : Timestamp;
}