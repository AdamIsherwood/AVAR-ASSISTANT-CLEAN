import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';

type MatchContext = StateFrom<typeof matchMachine>['context'];

export const generatePdfReport = (context: MatchContext) => {
  const doc = new jsPDF();

  doc.text('Match Report', 14, 16);

  // Bookings Table
  autoTable(doc, {
    startY: 22,
    head: [['Player ID', 'Card Type']],
    body: context.bookings
      .filter((booking) => !booking.deleted)
      .map((booking) => [booking.playerId, booking.cardType]),
  });

  // Goals Table
  autoTable(doc, {
    head: [['Team', 'Player ID']],
    body: context.goals.map((goal) => [goal.teamId, goal.playerId]),
  });

  doc.save('match-report.pdf');
};