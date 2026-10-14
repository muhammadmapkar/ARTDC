import type { Guidance, ProblemReport } from '../models/index.ts';

/** Fixed classroom examples behind a replaceable service interface. No vehicle is inspected. */
export interface DiagnosticService {
  assess(report: ProblemReport): Promise<Guidance>;
}

const generic: Guidance = {
  causes: [{ title: 'Several systems may be involved', explanation: 'A description alone cannot identify the failed part. A mechanic needs to inspect the vehicle.' }],
  questions: ['What tests will confirm the cause?', 'Can you show me the result before replacing a part?'],
  nextSteps: ['Describe when the problem occurs.', 'Ask for a written diagnosis and itemized quote.'],
};

export const mockDiagnosticService: DiagnosticService = {
  async assess(report) {
    let guidance: Guidance;
    switch (report.symptom) {
      case 'AC not cooling':
        guidance = {
          causes: [
            { title: 'Low cooling fluid', explanation: 'The AC may not have enough refrigerant. The reason for any loss should be checked before refilling.' },
            { title: 'Cooling component fault', explanation: 'A compressor or another AC component may not be working as intended. Ask what test supports replacement.' },
            { title: 'Electrical issue', explanation: 'A fuse, sensor or control problem can prevent the AC from cooling even when air flows.' },
          ],
          questions: ['What test shows the compressor needs replacement?', 'Is there evidence of a leak?', 'Will you provide the part category and warranty in writing?'],
          nextSteps: ['Book an AC inspection.', 'Request the test findings and an itemized quotation.', 'Approve costs only after the scope is clear.'],
        };
        break;
      case 'Brake noise':
        guidance = {
          ...generic,
          causes: [{ title: 'Possible brake wear or another fault', explanation: 'Noise can have several causes. A brake inspection is needed to assess safety.' }],
          safety: 'If braking feels weak, the pedal feels unusual, or a brake warning appears, stop driving safely and arrange professional assistance.',
        };
        break;
      case 'Warning light':
        guidance = {
          ...generic,
          causes: [{ title: 'A system needs inspection', explanation: 'A dashboard light identifies an area to check, not a confirmed part to replace.' }],
          safety: report.followUp === 'Flashing'
            ? 'A flashing warning light can signal an urgent problem. Stop safely and seek professional assistance.'
            : 'If the light is red, flashing or accompanied by poor performance, stop safely and seek professional assistance.',
        };
        break;
      case 'Strange engine noise':
        guidance = { ...generic, safety: 'If the noise is loud, sudden, or accompanied by overheating or loss of power, stop safely and seek professional assistance.' };
        break;
      case 'Car not starting':
        guidance = {
          ...generic,
          causes: [{ title: 'Starting or power system', explanation: 'A battery, starter, fuel or control issue may prevent starting. A mechanic must test which one applies.' }],
          safety: 'Avoid repeated start attempts if you smell fuel or notice smoke. Seek professional help.',
        };
        break;
      case 'Other issue':
        guidance = {
          ...generic,
          safety: report.followUp === 'Yes' || report.followUp === 'Not sure'
            ? 'If steering, braking or visibility is affected, stop driving safely and seek professional help.'
            : undefined,
        };
        break;
    }
    if (report.warningSigns.some(sign => sign !== 'None noticed')) {
      return {
        ...guidance,
        safety: `You reported a warning sign. Stop driving when it is safe to do so and seek qualified help before continuing. ${guidance.safety ?? ''}`.trim(),
      };
    }
    return guidance;
  },
};
