<?php

namespace App\Repositories;

/**
 * Class UserRepository
 * @package App\Repositories
 * @version July 28, 2022, 9:32 am UTC
 * @author TIMESHEET
*/

interface UserRepository
{
    /**
     * Configure the Model
     **/
    public function model();

    public function listUser($request);

}
