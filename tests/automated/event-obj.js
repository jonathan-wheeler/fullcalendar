describe('event object creation', function() {

	/*

	NOTE: Where possible, if there is a specific option that affects event object creation
	behavior, write your tests in the individual file for that option, instead of here.
	Examples of this:
		allDayDefault (tests allDay guessing behavior too)
		eventDataTransform
		forceEventDuration

	*/

	var event;

	beforeEach(function() {
		affix('#cal');
		event = null;
	});

	function init(singleEventData) {
		$('#cal').njCalendar({
			events: [ singleEventData ]
		});
		event = $('#cal').njCalendar('clientEvents')[0];
	}

	it('accepts `date` property as alias for `start`', function() {
		init({
			date: '2014-05-05'
		});
		expect(moment.isMoment(event.start)).toEqual(true);
		expect(event.start).toEqualMoment('2014-05-05');
	});

	it('doesn\'t produce an event when an invalid start', function() {
		init({
			start: new Date('asdf') // we use Date constructor to avoid annoying momentjs warning
		});
		expect(event).toBeUndefined();
	});

	it('doesn\'t produce an event when an invalid end', function() {
		init({
			end: new Date('asdf') // we use Date constructor to avoid annoying momentjs warning
		});
		expect(event).toBeUndefined();
	});

	it('strips times of dates when event is all-day', function() {
		init({
			start: '2014-05-01T01:00:00-12:00',
			end: '2014-05-02T01:00:00+12:00',
			allDay: true
		});
		expect(event.start.hasTime()).toEqual(false);
		expect(event.start).toEqualMoment('2014-05-01');
		expect(event.end.hasTime()).toEqual(false);
		expect(event.end).toEqualMoment('2014-05-02');
	});

	it('gives 00:00 times to ambiguously-timed dates when event is timed', function() {
		init({
			start: '2014-05-01',
			end: '2014-05-03',
			allDay: false
		});
		expect(event.start.hasTime()).toEqual(true);
		expect(event.start).toEqualMoment('2014-05-01T00:00:00');
		expect(event.end.hasTime()).toEqual(true);
		expect(event.end).toEqualMoment('2014-05-03T00:00:00');
	});

	it('sets the source', function() {
		init({
			start: '2014-05-01'
		});
		expect(typeof event.source).toEqual('object');
	});

	it('accepts an array `className`', function() {
		init({
			start: '2014-05-01',
			className: [ 'class1', 'class2' ]
		});
		expect($.isArray(event.className)).toEqual(true);
		expect(event.className).toEqual([ 'class1', 'class2' ]);
	});

	it('accepts a string `className`', function() {
		init({
			start: '2014-05-01',
			className: 'class1 class2'
		});
		expect($.isArray(event.className)).toEqual(true);
		expect(event.className).toEqual([ 'class1', 'class2' ]);
	});

	it('copies over custom properties', function() {
		init({
			start: '2014-05-01',
			prop1: 'prop1val',
			prop2: [ 'a', 'b' ]
		});
		expect(event.prop1).toEqual('prop1val');
		expect(event.prop2).toEqual([ 'a', 'b' ]);
	});

});