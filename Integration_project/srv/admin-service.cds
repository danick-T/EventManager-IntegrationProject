using { eventmanager as db } from '../db/schema';

service AdminService {

  @restrict: [{ grant: '*', to: 'Admin' }]
  entity Events as projection on db.Events;

  @restrict: [{ grant: '*', to: 'Admin' }]
  entity Sessions as projection on db.Sessions;

  @restrict: [{ grant: 'READ', to: 'Admin' }]
  entity Registrations as projection on db.Registrations;

  @restrict: [{ grant: 'READ', to: 'Admin' }]
  entity Feedback as projection on db.Feedback;

}
