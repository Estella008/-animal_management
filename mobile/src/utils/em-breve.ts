import { Alert } from 'react-native';

// Resposta padrão para os botões de funcionalidades que ainda serão implementadas
export function avisarEmBreve(funcionalidade: string) {
  Alert.alert(funcionalidade, 'Esta funcionalidade estará disponível em breve.');
}
