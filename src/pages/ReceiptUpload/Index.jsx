import React, { useState } from 'react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import InputError from '../../components/InputError';
import DataConfirmModal from '../../components/DataConfirmModal';
import imageUploadService from '../../api/services/imageUploadService';
import { expenditureService } from "../../api/services/expenditureService";
import { categoryService } from '../../api/services/categoryService';

export default function ReceiptUpload() {
  const [selectedFile, setSelectedFile] = useState('');
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState('');
  const [errors, setErrors] = useState({});
  const [receiptDataList, setReceiptDataList] = useState([]);
  const [expenditureCategoryInfoList, setExpenditureCategoryInfoList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getModalColumns = () => [
    {
      field: 'status',
      header: '処理',
      type: 'status',
      width: 'w-1/12'
    },
    {
      field: 'name',
      header: '商品名',
      type: 'text',
      width: 'w-4/12',
      placeholder: '商品名を入力'
    },
    {
      field: 'amount',
      header: '金額',
      type: 'number',
      width: 'w-2/12',
      placeholder: '金額を入力'
    },
    {
      field: 'category_id',
      header: 'カテゴリー名',
      type: 'select',
      width: 'w-3/12',
      options: expenditureCategoryInfoList.map(cat => ({
        value: cat.id,
        label: cat.name
      }))
    },
    {
      field: 'date',
      header: '支払い日時',
      type: 'date',
      width: 'w-2/12'
    },
    {
      field: 'delete',
      header: '',
      type: 'delete',
      width: 'w-min'
    }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ file: 'JPEG、JPG、PNGファイルのみアップロード可能です' });
      return;
    }

    setSelectedFile(file);
    setErrors({});

    const previewData = {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2)
    };
    
    setPreview(previewData);
  };

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }
    
    setSelectedFile('');
    setPreview('');
  };

  const processExtractedData = (responseData) => {
    if (!responseData || !responseData.data) {
      return [{
        id: null,
        name: '不明な商品',
        amount: 0,
        category_id: expenditureCategoryInfoList[0]?.id || 0,
        date: new Date().toISOString().split('T')[0]
      }];
    }

    const extractedData = responseData.data;

    if (extractedData.items && extractedData.items.length > 0) {
      return extractedData.items.map(item => ({
        id: null,
        name: item.name || '不明な商品',
        amount: item.total_price || item.price || 0,
        category_id: expenditureCategoryInfoList[0]?.id || 0,
        date: extractedData.date || new Date().toISOString().split('T')[0]
      }));
    }

    return [{
      id: null,
      name: extractedData.store_name || '不明な商品',
      amount: extractedData.total_amount || 0,
      category_id: expenditureCategoryInfoList[0]?.id || 0,
      date: extractedData.date || new Date().toISOString().split('T')[0]
    }];
  };

  const getExpenditureCategory = async () => {
    try {
      const categories = await categoryService.getExpenseCategories();
      setExpenditureCategoryInfoList(categories.expenditure_category_info_list);
    } catch (error) {
      console.error('カテゴリー取得エラー:', error);
      setExpenditureCategoryInfoList([
        { id: 1, name: '食費' },
        { id: 2, name: '交通費' },
        { id: 3, name: '娯楽費' },
        { id: 4, name: '日用品' },
        { id: 5, name: 'その他' }
      ]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrors({ file: 'アップロードするファイルを選択してください' });
      return;
    }

    setUploading(true);
    setUploadResult('');
    setErrors({});

    try {
      await getExpenditureCategory();
      
      const uploadResponse = await imageUploadService.uploadImage(selectedFile);
      
      const processedData = processExtractedData(uploadResponse);
      setReceiptDataList(processedData);
      
      setUploadResult({
        file: selectedFile.name,
        status: 'success',
        message: 'アップロード成功',
        data: processedData
      });
      
      setIsModalOpen(true);
      
      if (preview) {
        URL.revokeObjectURL(preview.url);
      }
      setSelectedFile('');
      setPreview('');
      
    } catch (error) {
      console.error('アップロードエラー:', error);
      setUploadResult({
        file: selectedFile.name,
        status: 'error',
        message: error.response?.data?.message || 'アップロードに失敗しました'
      });
    } finally {
      setUploading(false);
    }
  };

  const clearAll = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }
    setSelectedFile('');
    setPreview('');
    setUploadResult('');
    setErrors({});
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDataChange = (newDataList) => {
    setReceiptDataList(newDataList);
  };

  const handleDataDelete = (itemIndex) => {
    setReceiptDataList(prevList => 
      prevList.filter((_, index) => index !== itemIndex)
    );
  };

  const handleSave = () => {
    const formData = new FormData();

    receiptDataList.forEach((item, index) => {
            if (item.id) {
                formData.append(`items[${index}][id]`, item.id.toString());
            } else {
                formData.append(`items[${index}][id]`, '');
            }
            formData.append(`items[${index}][name]`, item.name);
            formData.append(`items[${index}][category_id]`, item.category_id.toString());
            formData.append(`items[${index}][amount]`, item.amount.toString());
            formData.append(`items[${index}][calendar_date]`, item.date);
      });

        expenditureService.bulkCreateExpenditure(formData)
            .then(() => {
                setIsModalOpen(false);
            });
  };

  return (
    <>
      <AuthenticatedLayout
        header={
          <div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              レシート登録
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              レシートや領収書の画像をアップロードして、支出データを自動で登録できます
            </p>
          </div>
        }
      >
        <div className="py-12">
          <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 bg-white border-b border-gray-200">
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    画像ファイルを選択
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>ファイルをアップロード</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileSelect}
                            disabled={uploading}
                          />
                        </label>
                        <p className="pl-1">またはドラッグ&ドロップ</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG ファイル対応（最大10MB）
                      </p>
                    </div>
                  </div>
                  <InputError message={errors.file} className="mt-2" />
                </div>

                {preview && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        選択された画像
                      </h3>
                      <SecondaryButton onClick={clearAll} disabled={uploading}>
                        クリア
                      </SecondaryButton>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-32 h-32 object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate" title={preview.name}>
                            {preview.name}
                          </p>
                          <p className="text-gray-500 text-sm">{preview.size} MB</p>
                          <button
                            onClick={removeFile}
                            disabled={uploading}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {preview && (
                  <div className="mb-6">
                    <PrimaryButton
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile}
                      className="w-full sm:w-auto"
                    >
                      {uploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          アップロード中...
                        </>
                      ) : (
                        '画像をアップロード'
                      )}
                    </PrimaryButton>
                    <InputError message={errors.upload} className="mt-2" />
                  </div>
                )}

                {uploadResult && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      アップロード結果
                    </h3>
                    <div
                      className={`p-3 rounded-md ${
                        uploadResult.status === 'success'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {uploadResult.status === 'success' ? (
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            uploadResult.status === 'success' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {uploadResult.file}
                          </p>
                          <p className={`text-sm ${
                            uploadResult.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {uploadResult.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        レシート登録について
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>レシートや領収書の画像をアップロードできます</li>
                          <li>アップロードされた画像は自動でテキスト解析され、支出データとして登録されます</li>
                          <li>対応形式：PNG, JPG, JPEG（最大10MB）</li>
                          <li>1度に1枚の画像をアップロードできます</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>

      <DataConfirmModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="レシートデータを確認してください"
        dataList={receiptDataList}
        columns={getModalColumns()}
        onDataChange={handleDataChange}
        onDataDelete={handleDataDelete}
        onSave={handleSave}
        saveButtonText="レシートデータを保存"
      />
    </>
  );
}
