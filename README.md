# BT-UDPT-1 - *Mini SNS*

**Mini SNS** là một bài tập 1 tại môn UDPT.

Thành viên:
* [ ] **1412579** Vũ Minh Trí (tên tài khoản github: boyvmt)
* [ ] **1412564** Trần Thuỳ Bích Trâm (tên tài khoản github)

URL: **https://lab01-579-564.herokuapp.com/**
* Một số tính năng do sử dụng host free thời gian res khá lâu nên em test trên host bị lỗi Server hoặc Timeout, mong thầy thông cảm ạ.
## Yêu cầu

Sinh viên check vào các mục bên dưới và ghi mã sinh viên đã làm vào chức năng theo mẫu. Mục nào ko có MSSV là tính điểm theo nhóm. Cần sắp xếp các chức năng bên dưới theo thứ tự MSSV đã thực hiện.

Yêu cầu **GIT**
* [v] Có sử dụng GIT.
* [ ] Sử dụng GIT theo Centralized Workflow.
* [ ] Sử dụng GIT theo Feature Branch Workflow.
* [v] Sử dụng GIT theo Gitflow Workflow.

Yêu cầu **bắt buộc**
* [ ] Thiết kế trang web theo responsive với bootstrap với header (navigation bar, logo), left menu, footer và content. (**MSSV**)
* [v] Navigation bar sẽ ẩn đi với kích thước màn hình nhỏ hơn 992px và có nút nhấn để hiển thị navigation bar. (**MSSV**)
* [v] Left menu sẽ ẩn đi khi kích thước màn hình nhỏ hơn 768px và có nút nhấn để hiển thị lại left menu. (**MSSV**)
* [v] Trang web được thiết kế sẽ bao gồm các trang: home, albums, about, blog. (**MSSV**)
* [ ] Khi nhấn vào trang albums sẽ thấy danh sách các album đã được lưu trữ trong hệ thống. Mỗi album bao gồm: ảnh cover, tên người tạo, tổng số view của các tấm ảnh trong album. (**MSSV**)
* [ ] Khi nhấn vào từng album sẽ sẽ chuyển sang danh sách các tấm ảnh trong album. Mỗi tấm ảnh hiển thị các thông tin: người đăng, số lượng view và tấm ảnh dưới dạng thumbnail. (**MSSV**)
* [v] Vào trang about sẽ thấy thông tin nhóm: tên nhóm, danh sách thành viên (mã sinh viên, họ tên, ảnh đại diện) và bản đồ google map hiển thị địa chỉ liên lạc của nhóm. (**MSSV**)
* [v] Vào trang blog sẽ thấy danh sách các bài viết, mỗi bài viết bao gồm: nội dung rút gọn, ảnh đại diện, người đăng và số view. (**MSSV**)
* [v] Nhấn vào mỗi bài viết sẽ thấy chi tiết bài viết cùng đầy đủ nội dung của bài viết. (**MSSV**)
* [v] Cho phép người dùng biết họ đang ở trang nào (sử dụng breadcrumb, highlight navigation bar,...). (**MSSV**)

Yêu cầu **không bắt buộc**:
* [v] Cho phép người dùng đăng nhập, đăng xuất, đăng ký thông tin tài khoản. (**MSSV**)
* [v] Có thể xem danh sách các comment của từng bài viết.  (**MSSV**)
* [v] Cho phép người dùng đã đăng nhập đăng thêm bài viết mới. (**MSSV**)
* [v] Cho phép người dùng đã đăng nhập comment cho bài viết. (**MSSV**)
* [ ] Quản lý thêm thông tin tag cho mỗi bài viết. Mỗi bài viết có thể bao gồm nhiều tag và mỗi tag có thể có nhiều bài viết. (**MSSV**)
* [v] Cho phép người dùng đăng nhập bằng tài khoản facebook và lấy ảnh đại diện, email từ facebook. (**MSSV**)
* [ ] Cho phép người dùng tạo album và đăng ảnh mới vào album. (**MSSV**)
* [ ] Chỉ cho phép người tạo album được phép thêm, xóa ảnh mình đã đăng vào album. (**MSSV**)
* [v] Chỉ cho phép người tạo bài viết được phép chỉnh sửa bài viết mình đã đăng. (**MSSV**)
* [ ] Cho phép người dùng layout bài viết bằng markdown. (**MSSV**)
* [v] Gửi mail cho người dùng khi người dùng đã đăng nhập thành công. (**MSSV**)
* [v] Gửi mail cho tác giả khi có người dùng comment vào bài viết của họ. (**MSSV**)

Liệt kê các **yêu cầu nâng cao** đã thực hiện:
* [v] Cho phép người dùng đăng nhập, đăng xuất, đăng ký thông tin tài khoản. (**1412579**)
* [v] Có thể xem danh sách các comment của từng bài viết.  (**1412579**)
* [v] Cho phép người dùng đã đăng nhập đăng thêm bài viết mới. (**1412579**)
* [v] Cho phép người dùng đã đăng nhập comment cho bài viết. (**1412579**)
* [v] Cho phép người dùng đăng nhập bằng tài khoản facebook và lấy ảnh đại diện, email từ facebook. (**1412579**)
* [v] Chỉ cho phép người tạo bài viết được phép chỉnh sửa bài viết mình đã đăng. (**1412579**)
* [v] Gửi mail cho người dùng khi người dùng đã đăng nhập thành công. (**1412579**)
* [v] Gửi mail cho tác giả khi có người dùng comment vào bài viết của họ. (**1412579**)
## Demo

Link video demo ứng dụng:

[![Demo Lab01 - 1412579 - 1412564](https://img.youtube.com/vi/NXeAIx_026g/0.jpg)](https://www.youtube.com/watch?v=NXeAIx_026g)

Link ảnh gif demo responsive:

** http://imgur.com/dvyfytX **

![alt tag](http://imgur.com/dvyfytX)

Tạo ảnh GIF với chương trình [LiceCap](http://www.cockos.com/licecap/).


## License

    Copyright [yyyy] [name of copyright owner]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
