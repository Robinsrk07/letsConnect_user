class DeletePhotoCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId, photoUrl) {
        const response = await this.userRepository.findOneAndDeletePhoto(userId, photoUrl);
        return response;
    }
}

module.exports = DeletePhotoCase;