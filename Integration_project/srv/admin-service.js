module.exports = function () {

    this.after('READ', 'Events', async function (events, req) {
        
        if (!events) return;

        const eventList = Array.isArray(events) ? events : [events];
        const { Registrations } = cds.entities;

        for (const event of eventList) {
            if (event.sessions && event.sessions.length > 0) {

                for (const session of event.sessions) {
                    if (!session.ID) continue;

                    const registrations = await cds.run(
                        SELECT.from(Registrations).where({ session_ID: session.ID })
                    );

                    const count = registrations ? registrations.length : 0;
                    session.availableSpots = (session.capacity || 0) - count;
                }
            }
        }
    });

    this.before('CREATE', 'Registrations', async function (req) {
        var sSessionId = req.data.session_ID;
        if (!sSessionId) {
            return req.error(400, "Session ID is required.");
        }

        const { Sessions, Registrations } = cds.entities;

        const session = await cds.run(
            SELECT.one.from(Sessions).where({ ID: sSessionId })
        );

        if (!session) {
            return req.error(404, "Session not found.");
        }

        const registrations = await cds.run(
            SELECT.from(Registrations).where({ session_ID: sSessionId })
        );

        const count = registrations ? registrations.length : 0;

        if (count >= session.capacity) {
            return req.error(409, "This session is fully booked.");
        }
    });
};