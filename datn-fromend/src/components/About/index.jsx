import React from 'react';

const About = () => {
    return (
        <>
            <div className="bg-gradient-to-r from-purple-200 to-purple-400 p-6 md:p-10 rounded-lg shadow-md">
                <h2 className="text-4xl font-bold text-center mb-4 text-purple-900">Giới thiệu về Trà Sữa XYZ</h2>
                <p className="text-lg text-gray-800 mb-8 text-center">
                    Chào mừng bạn đến với Trà Sữa XYZ, nơi mang đến những ly trà sữa thơm ngon và sáng tạo nhất.
                    Chúng tôi tự hào sử dụng nguyên liệu tươi ngon và công thức đặc biệt để tạo ra những hương vị tuyệt vời.
                    Với hơn 10 năm kinh nghiệm trong ngành, Trà Sữa XYZ đã khẳng định được vị thế của mình
                    trong lòng khách hàng và trở thành điểm đến lý tưởng cho những tín đồ yêu trà sữa.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600 hover:bg-purple-100 transition duration-200">
                    <h3 className="text-2xl font-semibold text-purple-800 mb-2">Sứ mệnh của chúng tôi</h3>
                    <p className="text-lg text-gray-700 mb-4">
                        Tại Trà Sữa XYZ, sứ mệnh của chúng tôi là mang đến cho khách hàng những trải nghiệm tuyệt vời nhất
                        với các sản phẩm trà sữa chất lượng, dịch vụ tận tâm và không gian thoải mái.
                        Chúng tôi tin rằng mỗi ly trà sữa không chỉ là một món uống mà còn là một tác phẩm nghệ thuật.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600 hover:bg-purple-100 transition duration-200">
                    <h3 className="text-2xl font-semibold text-purple-800 mb-2">Giá trị cốt lõi của chúng tôi</h3>
                    <p className="text-lg text-gray-700 mb-4">
                        Chúng tôi hoạt động dựa trên ba giá trị cốt lõi: Chất lượng, Đổi mới và Khách hàng.
                        Chúng tôi cam kết cung cấp sản phẩm chất lượng cao nhất và luôn cải tiến công thức
                        để mang lại những trải nghiệm mới lạ cho khách hàng.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600 hover:bg-purple-100 transition duration-200">
                    <h3 className="text-2xl font-semibold text-purple-800 mb-2">Sản phẩm của chúng tôi</h3>
                    <p className="text-lg text-gray-700 mb-4">
                        Chúng tôi cung cấp một loạt các loại trà sữa và đồ uống sáng tạo, từ trà sữa truyền thống
                        đến những công thức mới lạ và độc đáo. Tất cả sản phẩm của chúng tôi đều được chế biến từ
                        nguyên liệu tươi ngon và an toàn cho sức khỏe.
                        Đừng quên thử món trà sữa trân châu đặc biệt của chúng tôi!
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600 hover:bg-purple-100 transition duration-200">
                    <h3 className="text-2xl font-semibold text-purple-800 mb-2">Phản hồi từ khách hàng</h3>
                    <blockquote className="border-l-4 border-purple-800 pl-4 italic text-gray-600 mb-4">
                        "Trà Sữa XYZ là nơi tôi luôn ghé thăm mỗi lần muốn thưởng thức trà sữa. Hương vị tuyệt vời và dịch vụ thân thiện!" - Nguyễn Văn A
                    </blockquote>
                    <blockquote className="border-l-4 border-purple-800 pl-4 italic text-gray-600 mb-4">
                        "Tôi rất thích những sáng tạo mới từ Trà Sữa XYZ. Mỗi lần đến đều có những bất ngờ thú vị!" - Trần Thị B
                    </blockquote>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8 border-l-4 border-purple-600 hover:bg-purple-100 transition duration-200">
                <h3 className="text-2xl font-semibold text-purple-800 mb-2">Tham gia cùng chúng tôi</h3>
                <p className="text-lg text-gray-700 mb-4">
                    Chúng tôi không ngừng mở rộng và tìm kiếm những tài năng mới để gia nhập đội ngũ của mình.
                    Nếu bạn đam mê trà sữa và muốn làm việc trong một môi trường sáng tạo và năng động,
                    hãy ghé thăm trang tuyển dụng của chúng tôi để tìm hiểu thêm.
                </p>
                <button className="bg-purple-700 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                    Khám Phá Ngay
                </button>
            </div>
        </>
    );
};

export default About;
