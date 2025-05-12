import { ApartmentInfo } from './ApartmentInfo';
import { Apartment } from '../../../../server/src/apartment/apartment.entity';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '../../context/auth/AuthProvider';
import ApartmentSettings from './ApartmentSettings';
import RenterSettings from './RenterSettings';
import { ApartmentInfoDto, UserRoleName } from '@komuna/types';

enum CreateApartmentPages {
  ApartmentInfo,
  ApartmentSettings,
  RenterSettings,
}

export const CreateApartment = () => {
  const [page, setPage] = useState<CreateApartmentPages>(CreateApartmentPages.ApartmentInfo);

  const [apartmentInfo, setApartmentInfo] = useState<ApartmentInfoDto>({
    name: '',
    address: '',
    city: '',
    role: UserRoleName.Renter
  });

  // const [profileDetatils, setProfileDetails] = useState<CreateUserDto>({
  //   firstName: '',
  //   lastName: '',
  //   image: '/meerkats/waving.png',
  //   phoneNumber,
  // });

  // const [profileDetatils, setProfileDetails] = useState<CreateUserDto>({
  //   firstName: '',
  //   lastName: '',
  //   image: '/meerkats/waving.png',
  //   phoneNumber,
  // });

  const navigate = useNavigate();

  const goBack = useCallback(() => {
    setPage((oldPage) => {
      if (oldPage > 0) {
        return oldPage - 1;
      } else {
        navigate({ to: '/select-apartment' });
        return oldPage;
      }
    });
  }, [setPage]);



  switch (page) {
    case CreateApartmentPages.ApartmentInfo:
      return (
        <ApartmentInfo
          goBack={goBack}
        />
      );
    case CreateApartmentPages.ApartmentSettings:
      return (
        <ApartmentSettings
        // goBack={() => setPage(CreateApartmentPages.ApartmentInfo))}
        />
      );
    case CreateApartmentPages.RenterSettings:
      return (
        <RenterSettings />
      );
    default:
      return null;
  }
};

export default CreateApartment;
