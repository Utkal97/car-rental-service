class Customer {
    get getName() {
        return `${this.name}`;
    }

    set setName(new_name) {
        this.name = new_name;
    }

    get getPhoneNumber() {
        return this.phone_no;
    }

    set setPhoneNumber(new_number) {
        this.phone_no = new_number;
    }

    set setPassword(new_password) {
        this.password = new_password;
    }

    static findByName(searched_name) {
        return this.findOne({searched_name});
    }
}

module.exports = Customer;