export class AssignReservation {
    constructor(id, email, phone, isPrivate, modifiedDate) {
        this.email = email;
        this.id = id;
        this.phone = phone;
        this.private = isPrivate;
        this.modifiedDate = modifiedDate;
    }
}

  