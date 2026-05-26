module.exports = function () {

    this.after('READ', 'Events', async function (events, req) {

        if (!events) return;

        const eventList = Array.isArray(events) ? events : [events];
        const { Sessions, Registrations } = cds.entities('eventmanager');

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

        const ids = eventList.map(e => e.ID).filter(Boolean);
        if (!ids.length) return;

        const sessionRows = await cds.run(
            SELECT.from(Sessions)
                .columns('event_ID', 'ID')
                .where({ event_ID: { in: ids } })
        );

        const sessionCountByEvent = {};
        const sessionToEvent = {};
        for (const row of sessionRows) {
            sessionCountByEvent[row.event_ID] = (sessionCountByEvent[row.event_ID] || 0) + 1;
            sessionToEvent[row.ID] = row.event_ID;
        }

        const sessionIds = Object.keys(sessionToEvent);
        const registrationCountByEvent = {};
        if (sessionIds.length) {
            const regRows = await cds.run(
                SELECT.from(Registrations)
                    .columns('session_ID')
                    .where({ session_ID: { in: sessionIds } })
            );
            for (const row of regRows) {
                const eventId = sessionToEvent[row.session_ID];
                if (!eventId) continue;
                registrationCountByEvent[eventId] = (registrationCountByEvent[eventId] || 0) + 1;
            }
        }

        for (const event of eventList) {
            event.sessionCount      = sessionCountByEvent[event.ID] || 0;
            event.registrationCount = registrationCountByEvent[event.ID] || 0;
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