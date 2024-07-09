import { gql } from '@apollo/client';
console.log("inside mutations");
export const REQUEST_PASSWORD_RESET = gql`
  mutation requestPasswordReset($email: EmailInput!) {
    requestPasswordReset(email: $email)
  }
`;