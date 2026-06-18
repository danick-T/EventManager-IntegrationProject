using { eventmanager as db } from '../db/schema';

service AdminService {
  entity Users as projection on db.Users excluding { password };
  entity Events as projection on db.Events {
    *,
    virtual null as sessionCount      : Integer,
    virtual null as registrationCount : Integer
  };
  entity Sessions as projection on db.Sessions {
    *,
    null as availableSpots : Integer,
    registrations : redirected to Registrations
  };
  entity Registrations as projection on db.Registrations {
    *,
    feedback : redirected to Feedback
  };
  entity Feedback as projection on db.Feedback;

}

/**
 *@restrict: [{ grant: '*', to: 'Admin' }]
  entity Events as projection on db.Events;

  @restrict: [{ grant: '*', to: 'Admin' }]
  entity Sessions as projection on db.Sessions;

  @restrict: [{ grant: 'READ', to: 'Admin' }]
  entity Registrations as projection on db.Registrations;

  @restrict: [{ grant: 'READ', to: 'Admin' }]
  entity Feedback as projection on db.Feedback;
 */
