import AnnotationKnowledgeBank from '../../state_management/AnnotationKnowledgeBank';

module Reporter {
  export function generateReport(info: AnnotationKnowledgeBank.AnnotationInformation):string {
    return JSON.stringify(info);
  }
}