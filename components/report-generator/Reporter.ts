import AnnotationKnowledgeBank from '../../state_management/AKB/AnnotationKnowledgeBank';

module Reporter {
  export function generateReport(info: AnnotationKnowledgeBank.AnnotationInformation):string {
    return JSON.stringify(info);
  }
}