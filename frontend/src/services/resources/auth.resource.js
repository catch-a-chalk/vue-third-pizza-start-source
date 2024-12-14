import { AuthService } from "@/seervices/api/auth.service";

export class AuthResource extends AuthService {
  constructor() {
    super("/api");
  }
}