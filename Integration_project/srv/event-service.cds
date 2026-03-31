using { eventmanager as db } from '../db/schema';

service EventService {

  entity Events as projection on db.Events;
  entity Sessions as projection on db.Sessions {
    *,
    null as availableSpots : Integer
  };
  entity Registrations as projection on db.Registrations;
  entity Feedback as projection on db.Feedback;

}

/**

service EventService {

  @restrict: [{ grant: 'READ', to: 'User' }]
  entity Events as projection on db.Events;

  @restrict: [{ grant: 'READ', to: 'User' }]
  entity Sessions as projection on db.Sessions;

  @restrict: [{ grant: ['READ','CREATE'], to: 'User' }]
  entity Registrations as projection on db.Registrations;

  @restrict: [{ grant: ['READ','CREATE'], to: 'User' }]
  entity Feedback as projection on db.Feedback;

}
 */
